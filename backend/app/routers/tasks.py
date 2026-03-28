"""Tasks router - CRUD with auto project progress update. MSc Cloud DevOpsSec - Construction Progress Tracker"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Project, Task, User, TaskStatus
from app.schemas import TaskRequest, TaskResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/projects/{project_id}/tasks", tags=["Tasks"])

def to_response(t: Task) -> dict:
    return {
        "id": t.id, "title": t.title, "description": t.description or "",
        "assignedTo": t.assigned_to, "status": t.status.value,
        "progress": t.progress, "dueDate": t.due_date,
        "notes": t.notes or "", "createdAt": t.created_at, "projectId": t.project_id,
    }

def get_user_project(project_id: int, db: Session, user: User) -> Project:
    p = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p

def recalculate_progress(project: Project, db: Session):
    """Auto-update project overall_progress from average task progress."""
    tasks = project.tasks
    if not tasks:
        project.overall_progress = 0
    else:
        project.overall_progress = sum(t.progress for t in tasks) // len(tasks)
    db.flush()

@router.get("", response_model=List[TaskResponse])
def get_tasks(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_project(project_id, db, user)
    return [to_response(t) for t in p.tasks]

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(project_id: int, task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_project(project_id, db, user)
    t = db.query(Task).filter(Task.id == task_id, Task.project_id == p.id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    return to_response(t)

@router.post("", response_model=TaskResponse, status_code=201)
def create_task(project_id: int, req: TaskRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_project(project_id, db, user)
    t = Task(title=req.title, description=req.description or "", assigned_to=req.assignedTo,
             status=TaskStatus(req.status or "PENDING"), progress=req.progress,
             due_date=req.dueDate, notes=req.notes or "", project_id=p.id)
    db.add(t)
    db.flush()
    recalculate_progress(p, db)
    db.commit()
    db.refresh(t)
    return to_response(t)

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(project_id: int, task_id: int, req: TaskRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_project(project_id, db, user)
    t = db.query(Task).filter(Task.id == task_id, Task.project_id == p.id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    t.title = req.title
    t.description = req.description or ""
    t.assigned_to = req.assignedTo
    if req.status and req.status in [s.value for s in TaskStatus]:
        t.status = TaskStatus(req.status)
    t.progress = req.progress
    t.due_date = req.dueDate
    t.notes = req.notes or ""
    db.flush()
    recalculate_progress(p, db)
    db.commit()
    db.refresh(t)
    return to_response(t)

@router.delete("/{task_id}", status_code=204)
def delete_task(project_id: int, task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = get_user_project(project_id, db, user)
    t = db.query(Task).filter(Task.id == task_id, Task.project_id == p.id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(t)
    db.flush()
    recalculate_progress(p, db)
    db.commit()
