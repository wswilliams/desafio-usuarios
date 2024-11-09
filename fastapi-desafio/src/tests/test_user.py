import json

import pytest

from app.services import service_user as service


def test_create_user(test_app, monkeypatch):
    test_data = {"nome": "something", "cpf": "123456789", "cpf": "123456789", "endereco": "123456789", "telefone": "123456789", "id": 1}

    def mock_post(db_session, payload):
        return test_data

    monkeypatch.setattr(service, "post", mock_post)

    response = test_app.post("/users/", content=json.dumps(test_data),)
    assert response.status_code == 201
    assert response.json() == test_data


def test_create_note_invalid_json(test_app):
    response = test_app.post("/users/", content=json.dumps({"nome": "something"}))
    assert response.status_code == 422

    response = test_app.post(
        "/users/", content=json.dumps({"nome": "1", "cpf": "2"})
    )
    assert response.status_code == 422


def test_read_user(test_app, monkeypatch):
    test_data = {"nome": "something", "cpf": "123456789", "cep": "123456789", "endereco": "123456789", "telefone": "123456789", "id": 1}

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
        {"nome": "something", "cpf": "123456789", "cep": "123456789", "endereco": "123456789", "telefone": "123456789", "id": 1},
        {"nome": "something", "cpf": "987654321", "cep": "987654321", "endereco": "987654321", "telefone": "987654321", "id": 2},
    ]

    def mock_get_all(db_session):
        return test_data

    monkeypatch.setattr(service, "get_all", mock_get_all)

    response = test_app.get("/users/")
    assert response.status_code == 200
    assert response.json() == test_data


def test_update_user(test_app, monkeypatch):
    test_data = {"nome": "something", "cpf": "123456789", "cep": "123456789", "endereco": "123456789", "telefone": "123456789", "id": 1}
    test_update_data = {"nome": "something", "cpf": "987654321", "cep": "987654321", "endereco": "987654321", "telefone": "987654321", "id": 1}

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
        [1, {"cpf": "bar"}, 422],
        [999, {"nome": "something", "cpf": "123456789", "cep": "123456789", "endereco": "123456789", "telefone": "123456789"}, 404],
        [1, {"nome": "1", "cpf": "bar", "cep": "bar", "endereco": "bar", "telefone": "bar"}, 422],
        [1, {"nome": "foo", "cpf": "1", "cep": "1", "endereco": "1", "telefone": "1"}, 422],
        [0, {"nome": "foo", "cpf": "bar", "cep": "bar", "endereco": "bar", "telefone": "bar"}, 422],
    ],
)
def test_update_user_invalid(test_app, monkeypatch, id, payload, status_code):
    def mock_get(db_session, id):
        return None

    monkeypatch.setattr(service, "get", mock_get)

    response = test_app.put(f"/users/{id}/", content=json.dumps(payload),)
    assert response.status_code == status_code
