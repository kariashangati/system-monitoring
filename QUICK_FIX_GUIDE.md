# Quick Fix Guide for Deployment Issues

## Issue: Invalid `prisma.role.createMany()` invocation - Table does not exist

### What Happened
- Database migration was never created
- When app starts on Railway, `prisma migrate deploy` finds no migrations
- Tables don't exist, installation fails at role creation

### What We Fixed
✅ **Created migration**: `prisma/migrations/20260614000000_init/migration.sql`
✅ **Added migration lock**: `.migration_lock.toml`
✅ **Created TypeScript types**: `src/types.ts`
✅ **Created Prisma client**: `src/db/prisma.ts`
✅ **Updated .env.example**: Added all required variables
✅ **Added Railway config**: `railway.json` and `Procfile`

---

## Fix #1: Complete Line 164 in server.ts

**Current (BROKEN)**:
```typescript
await prisma.uptimeCheck.create({ data: { id: log.id, monitorId: 'dummy-monitor', status: log.status, responseTime: log.responseTime, errorDetails: log.errorDetails, proxyUsed: log.proxyUsed,[...]
```

**Fixed**:
```typescript
await prisma.uptimeCheck.create({ 
  data: { 
    id: log.id, 
    monitorId: 'dummy-monitor', 
    status: log.status, 
    responseTime: log.responseTime, 
    errorDetails: log.errorDetails, 
    proxyUsed: log.proxyUsed,
    timestamp: new Date(log.timestamp)
  } 
});
```

---

## Railway Deployment Commands

```bash
# 1. Push updates to GitHub
git add .
git commit -m "Fix database migration and deployment issues"
git push origin main

# 2. Install Railway CLI
npm install -g @railway/cli

# 3. Login to Railway
railway login

# 4. Initialize project (if new)
railway init

# 5. Set environment variables
railway variable set DATABASE_URL "postgresql://..."
railway variable set JWT_SECRET "$(openssl rand -base64 32)"
railway variable set NODE_ENV "production"

# 6. Deploy
railway up

# 7. Check logs
railway logs
```

---

## Testing After Deployment

```bash
# Test installer status
curl https://your-app.railway.app/api/installer/status

# Should return: {"isInstalled":false,"needsMigration":false}

# If you see: {"isInstalled":false,"needsMigration":true}
# Run migrations manually in Railway shell:
railway shell
npm run build
npx prisma migrate deploy
exit
```

---

## Success Indicators ✅

- [ ] Server starts without errors
- [ ] `/api/installer/status` returns `{isInstalled: false}`
- [ ] Can POST to `/api/installer/install` with setup data
- [ ] Admin user created successfully
- [ ] Can login with admin credentials
- [ ] JWT token returned from `/api/auth/login`
- [ ] Monitoring loop starts (check logs)

---

## Still Getting Errors?

### Error: "table does not exist"
- Migrations didn't run. In Railway shell: `npx prisma migrate deploy`

### Error: "cannot find module '@prisma/client'"
- Dependencies not installed. In Railway shell: `npm install`

### Error: "DATABASE_URL not set"
- Missing environment variable. Add via Railway dashboard

### Error: "JWT verification failed"
- JWT_SECRET not matching. Regenerate and redeploy

---

## Files Changed

1. ✅ `prisma/migrations/20260614000000_init/migration.sql` - Database schema
2. ✅ `prisma/migrations/.migration_lock.toml` - Migration lock
3. ✅ `src/types.ts` - TypeScript interfaces
4. ✅ `src/db/prisma.ts` - Prisma client export
5. ✅ `.env.example` - Environment template
6. ✅ `railway.json` - Railway build config
7. ✅ `Procfile` - Process definition
8. ⏳ `server.ts` - Line 164 needs manual fix (timestamp field)

---

## Next Steps

1. **Complete the server.ts fix** for line 164
2. **Push all changes** to GitHub
3. **Deploy to Railway** using commands above
4. **Run installation** via API
5. **Monitor logs** for any runtime errors
6. **Test full workflow** - login, monitoring, alerts

Good luck! 🚀
