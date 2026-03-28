"""Project CRUD tests."""
def test_create(client, auth_headers):
    r = client.post("/api/projects", json={"name":"P1","location":"Cork","startDate":"2026-06-01","expectedEndDate":"2027-01-01","budget":50000}, headers=auth_headers)
    assert r.status_code == 201 and r.json()["name"] == "P1"
def test_list(client, auth_headers):
    assert client.get("/api/projects", headers=auth_headers).status_code == 200
def test_get(client, auth_headers, test_project):
    assert client.get(f"/api/projects/{test_project.id}", headers=auth_headers).status_code == 200
def test_update(client, auth_headers, test_project):
    r = client.put(f"/api/projects/{test_project.id}", json={"name":"Updated","location":"Cork","startDate":"2026-06-01","expectedEndDate":"2027-01-01","budget":99999}, headers=auth_headers)
    assert r.status_code == 200 and r.json()["name"] == "Updated"
def test_delete(client, auth_headers, test_project):
    assert client.delete(f"/api/projects/{test_project.id}", headers=auth_headers).status_code == 204
def test_not_found(client, auth_headers):
    assert client.get("/api/projects/99999", headers=auth_headers).status_code == 404
def test_date_validation(client, auth_headers):
    r = client.post("/api/projects", json={"name":"Bad","location":"X","startDate":"2027-01-01","expectedEndDate":"2026-01-01","budget":100}, headers=auth_headers)
    assert r.status_code in [400, 422]
def test_auth_required(client):
    assert client.get("/api/projects").status_code in [401, 403]
