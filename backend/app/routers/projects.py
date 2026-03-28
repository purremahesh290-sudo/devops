"""Projects router - CRUD with auto progress calculation. MSc Cloud DevOpsSec - Construction Progress Tracker"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Project, Task, User, ProjectStatus, TaskStatus
from app.schemas import ProjectRequest, ProjectResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["Projects"])

def to_response(p: Project) -> dict:
    tasks = p.tasks if p.tasks else []
    completed = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
    return {
        "id": p.id, "name": p.name, "description": p.description or "",
        "location": p.location, "startDate": p.start_date,
        "expectedEndDate": p.expected_end_date, "budget": p.budget,
        "status": p.status.value, "overallProgress": p.overall_progress,
        "createdAt": p.created_at, "taskCount": len(tasks),
        "completedTaskCount": completed,
    }

def recalculate_progress(project: Project):
    """Auto-calculate project progress from task completion percentages."""
    tasks = project.tasks
    if not tasks:
        project.overall_progress = 0
        return
    total = sum(t.progress for t in tasks)
    project.overall_progress = total // len(tasks)

@router.get("", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.owner_id == user.id).order_by(Project.created_at.desc()).all()
    return [to_response(p) for p in projects]

@router.get("/{pid}", response_model=ProjectResponse)
def get_project(pid: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == pid, Project.owner_id == user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return to_response(p)

@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(req: ProjectRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if req.startDate > req.expectedEndDate:
        raise HTTPException(status_code=400, detail="Start date must be before end date")
    p = Project(name=req.name, description=req.description or "", location=req.location,
                start_date=req.startDate, expected_end_date=req.expectedEndDate,
                budget=req.budget, status=ProjectStatus(req.status or "PLANNING"), owner_id=user.id)
    db.add(p)
    db.commit()
    db.refresh(p)
    return to_response(p)

@router.put("/{pid}", response_model=ProjectResponse)
def update_project(pid: int, req: ProjectRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == pid, Project.owner_id == user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    p.name = req.name
    p.description = req.description or ""
    p.location = req.location
    p.start_date = req.startDate
    p.expected_end_date = req.expectedEndDate
    p.budget = req.budget
    if req.status and req.status in [s.value for s in ProjectStatus]:
        p.status = ProjectStatus(req.status)
    db.commit()
    db.refresh(p)
    return to_response(p)

@router.delete("/{pid}", status_code=204)
def delete_project(pid: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    p = db.query(Project).filter(Project.id == pid, Project.owner_id == user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(p)
    db.commit()
