"""
Pydantic Schemas for request/response validation.
MSc Cloud DevOpsSec - Construction Progress Tracker
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)

class AuthResponse(BaseModel):
    token: str
    username: str
    role: str

class MessageResponse(BaseModel):
    message: str

class ProjectRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = ""
    location: str = Field(..., min_length=2, max_length=300)
    startDate: str = Field(..., min_length=10, max_length=10)
    expectedEndDate: str = Field(..., min_length=10, max_length=10)
    budget: float = Field(..., gt=0)
    status: Optional[str] = "PLANNING"

class TaskRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = ""
    assignedTo: str = Field(..., min_length=2, max_length=100)
    status: Optional[str] = "PENDING"
    progress: int = Field(default=0, ge=0, le=100)
    dueDate: str = Field(..., min_length=10, max_length=10)
    notes: Optional[str] = ""

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    assignedTo: str
    status: str
    progress: int
    dueDate: str
    notes: Optional[str] = None
    createdAt: Optional[datetime] = None
    projectId: int

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    location: str
    startDate: str
    expectedEndDate: str
    budget: float
    status: str
    overallProgress: int
    createdAt: Optional[datetime] = None
    taskCount: Optional[int] = 0
    completedTaskCount: Optional[int] = 0
