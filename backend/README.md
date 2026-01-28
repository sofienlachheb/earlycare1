# Smart Health Backend (Django)

## 1) Install
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

## 2) Run migrations
```bash
python manage.py migrate
python manage.py createsuperuser
```

## 3) Start server
```bash
python manage.py runserver 8000
```

## API
- `GET /api/profiles/` list
- `POST /api/profiles/` create
- `PATCH /api/profiles/<id>/` update
- `POST /api/calculate/` calculate risks + factors from JSON payload (no save)




