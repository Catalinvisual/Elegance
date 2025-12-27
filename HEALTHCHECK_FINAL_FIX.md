# REBUILD TRIGGER

## Modificări aplicate pentru fixarea healthcheck-ului:

1. ✅ Adăugat HEALTHCHECK în Dockerfile cu start-period de 60s
2. ✅ Actualizat railway.json să folosească `/api/health` în loc de `/`
3. ✅ Adăugat script de startup cu delay de 5 secunde
4. ✅ Mărit timeout-ul healthcheck-ului la 60s
5. ✅ Adăugat `sleepApplication: false` pentru a preveni sleep

## Script de startup:
- Așteaptă 5 secunde pentru stabilizare
- Verifică existența directorului dist
- Pornește serverul cu logging complet

## Ce ar trebui să funcționeze:
- Healthcheck-ul va aștepta 60s înainte de a începe verificările
- Va verifica `/api/health` în loc de `/`
- Serverul va avea timp să pornească complet

Data: 2025-12-27
Ora: 17:30

**TRIGGER: Acest fișier forțează un rebuild complet!**