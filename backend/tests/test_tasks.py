"""Task CRUD tests with auto progress."""
def test_create_task(client, auth_headers, test_project):
    r = client.post(f"/api/projects/{test_project.id}/tasks", json={
        "title":"T1","assignedTo":"John","dueDate":"2026-07-01","progress":0,"status":"PENDING"
    }, headers=auth_headers)
    assert r.status_code == 201
    assert r.json()["title"] == "T1"

def test_list_tasks(client, auth_headers, test_project):
    assert client.get(f"/api/projects/{test_project.id}/tasks", headers=auth_headers).status_code == 200

def test_update_task_progress(client, auth_headers, test_project):
    cr = client.post(f"/api/projects/{test_project.id}/tasks", json={
        "title":"T2","assignedTo":"Sean","dueDate":"2026-07-01","progress":0,"status":"PENDING"
    }, headers=auth_headers)
    assert cr.status_code == 201
    tid = cr.json()["id"]
    client.put(f"/api/projects/{test_project.id}/tasks/{tid}", json={
        "title":"T2","assignedTo":"Sean","dueDate":"2026-07-01","progress":80,"status":"IN_PROGRESS"
    }, headers=auth_headers)
    p = client.get(f"/api/projects/{test_project.id}", headers=auth_headers).json()
    assert p["overallProgress"] == 80

def test_delete_task(client, auth_headers, test_project):
    cr = client.post(f"/api/projects/{test_project.id}/tasks", json={
        "title":"Delete Me","assignedTo":"Worker X","dueDate":"2026-07-01","progress":0,"status":"PENDING"
    }, headers=auth_headers)
    assert cr.status_code == 201
    tid = cr.json()["id"]
    assert client.delete(f"/api/projects/{test_project.id}/tasks/{tid}", headers=auth_headers).status_code == 204

def test_task_not_found(client, auth_headers, test_project):
    assert client.get(f"/api/projects/{test_project.id}/tasks/99999", headers=auth_headers).status_code == 404

def test_auto_progress_multi(client, auth_headers, test_project):
    r1 = client.post(f"/api/projects/{test_project.id}/tasks", json={
        "title":"Task Alpha","assignedTo":"Worker X","dueDate":"2026-07-01","progress":100,"status":"COMPLETED"
    }, headers=auth_headers)
    assert r1.status_code == 201
    r2 = client.post(f"/api/projects/{test_project.id}/tasks", json={
        "title":"Task Beta","assignedTo":"Worker Y","dueDate":"2026-07-01","progress":50,"status":"IN_PROGRESS"
    }, headers=auth_headers)
    assert r2.status_code == 201
    p = client.get(f"/api/projects/{test_project.id}", headers=auth_headers).json()
    assert p["overallProgress"] == 75
