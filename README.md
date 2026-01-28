# Smart Health (React + Django)

هذا مشروع جاهز (Frontend + Backend) بنفس فكرة واجهتك القديمة **"صحتك الذكية"** لكن الآن:
- **Frontend**: React + React Router
- **Backend**: Django + DRF (REST API) مع نفس منطق حساب المخاطر مكتوب ببايثون

---

## 1) تشغيل الـ Backend (Django)

### المتطلبات
- Python 3.10+

### الخطوات
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

سيعمل الـ API هنا:
- `http://localhost:8000/api/profiles/`
- `http://localhost:8000/api/profiles/latest/`
- `http://localhost:8000/api/risks/calculate/`

---

## 2) تشغيل الـ Frontend (React)

```bash
cd smart-health-react
npm install
npm run dev
```

الواجهة على (غالباً):
- `http://localhost:5173`

---

## ملاحظات مهمة
- CORS مفعّل افتراضياً للـ dev.
- منطق المخاطر موجود في: `backend/health/logic.py`
- يمكنك توصيل الواجهة بالـ API لاحقاً (سأقوم لك بتعديل صفحات React لو تحب).
