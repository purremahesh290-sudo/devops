"""
FastAPI Application Entry Point - Construction Progress Tracker.
Seeds demo data for examiner access on startup.
MSc Cloud DevOpsSec - Construction Progress Tracker
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, Project, Task, UserRole, ProjectStatus, TaskStatus
from app.auth import hash_password
from app.routers import auth, projects, tasks

app = FastAPI(title=settings.APP_NAME, version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)

def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == "examiner").first():
            return
        admin = User(username="examiner", email="examiner@nci.ie",
                     password_hash=hash_password("ConstructTrack2024"), role=UserRole.MANAGER)
        db.add(admin)
        db.flush()

        p1 = Project(name="Dublin Office Complex", description="New 12-storey commercial building in Dublin docklands",
                     location="Dublin 2, Ireland", start_date="2026-01-15", expected_end_date="2027-06-30",
                     budget=4500000.0, status=ProjectStatus.IN_PROGRESS, overall_progress=35, owner_id=admin.id)
        p2 = Project(name="Cork Residential Estate", description="50-unit housing development in Cork suburbs",
                     location="Ballincollig, Cork", start_date="2026-03-01", expected_end_date="2027-12-31",
                     budget=8200000.0, status=ProjectStatus.PLANNING, overall_progress=0, owner_id=admin.id)
        p3 = Project(name="Galway Bridge Repair", description="Structural repair of Salmon Weir Bridge",
                     location="Galway City Centre", start_date="2025-09-01", expected_end_date="2026-02-28",
                     budget=750000.0, status=ProjectStatus.COMPLETED, overall_progress=100, owner_id=admin.id)
        db.add_all([p1, p2, p3])
        db.flush()

        tasks_data = [
            Task(title="Foundation excavation", assigned_to="John Murphy", status=TaskStatus.COMPLETED,
                 progress=100, due_date="2026-03-15", project_id=p1.id, notes="Completed on schedule"),
            Task(title="Steel framework", assigned_to="Sean O'Brien", status=TaskStatus.IN_PROGRESS,
                 progress=45, due_date="2026-06-01", project_id=p1.id, notes="Floor 5 in progress"),
            Task(title="Electrical wiring", assigned_to="Mary Walsh", status=TaskStatus.PENDING,
                 progress=0, due_date="2026-08-15", project_id=p1.id),
            Task(title="Site survey", assigned_to="Patrick Kelly", status=TaskStatus.COMPLETED,
                 progress=100, due_date="2026-04-01", project_id=p2.id, notes="Survey approved"),
            Task(title="Planning permission", assigned_to="Aoife Ryan", status=TaskStatus.IN_PROGRESS,
                 progress=60, due_date="2026-05-15", project_id=p2.id),
            Task(title="Structural assessment", assigned_to="Liam Byrne", status=TaskStatus.COMPLETED,
                 progress=100, due_date="2025-10-01", project_id=p3.id),
            Task(title="Bridge resurfacing", assigned_to="Ciara Doyle", status=TaskStatus.COMPLETED,
                 progress=100, due_date="2026-01-15", project_id=p3.id),
        ]
        db.add_all(tasks_data)
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        seed_demo_data()
    except Exception:
        pass

@app.get("/actuator/health")
def health_check():
    return {"status": "UP", "application": settings.APP_NAME}
