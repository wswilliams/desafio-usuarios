import json

import pytest
from datetime import datetime

from app.services import service_user as service


def test_create_user(test_app, monkeypatch):
    test_data = {"nome": "admin", "email": "admin@example.com", "senha": "admin123", "status": "ativo", "tipo": "admin",  "created_date": datetime.utcnow(), "id": 1}

    def mock_post(db_session, payload):
        return test_data

    monkeypatch.setattr(service, "post", mock_post)

    response = test_app.post("/users/", content=json.dumps(test_data),)
    assert response.status_code == 201
    assert response.json() == test_data


def test_create_note_invalid_json(test_app):
    response = test_app.post("/users/", content=json.dumps({"nome": "admin"}))
    assert response.status_code == 422

    response = test_app.post(
        "/users/", content=json.dumps({"nome": "1", "email": "2"})
    )
    assert response.status_code == 422


def test_read_user(test_app, monkeypatch):
    test_data = {"nome": "admin", "email": "admin@example.com", "senha": "admin123", "status": "ativo", "tipo": "admin",  "created_date": datetime.utcnow(), "id": 1}

    def mock_get(db_session, id):
        return test_data

    monkeypatch.setattr(service, "get", mock_get)

    response = test_app.get("/user/1")
    assert response.status_code == 200
    assert response.json() == test_data


def test_read_user_incorrect_id(test_app, monkeypatch):
    def mock_get(db_session, id):
        return None

    monkeypatch.setattr(service, "get", mock_get)

    response = test_app.get("/users/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "user not found"

    response = test_app.get("/users/0")
    assert response.status_code == 422


def test_read_all_users(test_app, monkeypatch):
    test_data = [
       {"nome": "admin", "email": "admin@example.com", "senha": "admin123", "status": "ativo", "tipo": "admin",  "created_date": datetime.utcnow(), "id": 1}
        {"nome": "admin1", "email": "admin1@example.com", "senha": "admin1234", "status": "ativo", "tipo": "admin",  "created_date": datetime.utcnow(), "id": 2},
    ]

    def mock_get_all(db_session):
        return test_data

    monkeypatch.setattr(service, "get_all", mock_get_all)

    response = test_app.get("/users/")
    assert response.status_code == 200
    assert response.json() == test_data


def test_update_user(test_app, monkeypatch):
    test_data =  {"nome": "admin", "email": "admin@example.com", "senha": "admin123", "status": "ativo", "tipo": "admin",  "created_date": datetime.utcnow(), "id": 1}
   test_update_data = {"nome": "admin1", "email": "admin1@example.com", "senha": "admin1234", "status": "ativo", "tipo": "admin",  "created_date": datetime.utcnow(), "id": 2},

    def mock_get(db_session, id):
        return test_data

    monkeypatch.setattr(service, "get", mock_get)

    def mock_put(db_session, user, nome, cpf, cep, endereco, telefone):
        return test_update_data

    monkeypatch.setattr(service, "put", mock_put)

    response = test_app.put("/users/1/", content=json.dumps(test_update_data),)
    assert response.status_code == 200
    assert response.json() == test_update_data


@pytest.mark.parametrize(
    "id, payload, status_code",
    [
        [1, {}, 422],
        [1, {"email": "bar"}, 422],
        [999, {"nome": "admin", "email": "123456789", "senha": "123456789", "status": "123456789", "tipo": "123456789"}, 404],
        [1, {"nome": "1", "email": "bar", "senha": "bar", "status": "bar", "tipo": "bar"}, 422],
        [1, {"nome": "foo", "email": "1", "senha": "1", "status": "1", "tipo": "1"}, 422],
        [0, {"nome": "foo", "email": "bar", "senha": "bar", "status": "bar", "tipo": "bar"}, 422],
    ],
)
def test_update_user_invalid(test_app, monkeypatch, id, payload, status_code):
    def mock_get(db_session, id):
        return None

    monkeypatch.setattr(service, "get", mock_get)

    response = test_app.put(f"/users/{id}/", content=json.dumps(payload),)
    assert response.status_code == status_code
