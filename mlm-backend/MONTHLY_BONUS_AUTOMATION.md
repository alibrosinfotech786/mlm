# Monthly Bonus Automation

## Overview
The system automatically processes **Sponsor Royalty Bonuses** and **Team Performance Bonuses** for all active users at the end of each month.

## Automatic Processing Schedule

### When It Runs
- **Date**: Last day of every month (31st, or last day if month has fewer days)
- **Sponsor Royalty**: 23:50 (11:50 PM)
- **Team Performance**: 23:55 (11:55 PM)
- **Method**: Direct controller method calls

### What Gets Processed

#### 1. Sponsor Royalty Bonus
- Processes for all active users
- Calculates bonuses for levels 1-4 based on:
  - Level 1: 20% (requires 2 users)
  - Level 2: 5% (requires 4 users)
  - Level 3: 3% (requires 8 users)
  - Level 4: 2% (requires 16 users)
- Credits bonus to `wallet_balance`
- Creates `wallet_histories` records
- Generates `level_bonus_reports`

#### 2. Team Performance Bonus
- Processes for all active users
- Calculates 20% of matching BV between left and right teams
- Applies maximum limit of 5000 per cycle
- Maintains carry forward for unused BV
- Credits bonus to `wallet_balance`
- Creates `wallet_histories` records
- Generates `team_performance_bonuses` records

## Server Setup Required

### For Linux/Unix Servers
Add this cron job to your server:

```bash
* * * * * cd /path/to/mlm-backend && php artisan schedule:run >> /dev/null 2>&1
```

### For Windows Servers
Use Task Scheduler to run this command every minute:

```cmd
cd C:\xampp\htdocs\mlm-new\mlm-backend && php artisan schedule:run
```

## Manual Testing

### Check scheduled tasks:
```bash
php artisan schedule:list
```

### Test via API endpoints:
```bash
# Test sponsor royalty for a user
POST /api/users/process-sponsor-royalty-bonus
{"user_id": "JH01-0000001"}

# Test team performance for a user
POST /api/users/process-team-performance-bonus
{"user_id": "JH01-0000001"}
```

## Monitoring

### Check Processing Logs
- Sponsor Royalty: Check `level_bonus_reports` table
- Team Performance: Check `team_performance_bonuses` (matching_income_reports) table
- Wallet Credits: Check `wallet_histories` table

### Verify Processing
```sql
-- Check last sponsor royalty processing
SELECT * FROM level_bonus_reports ORDER BY created_at DESC LIMIT 10;

-- Check last team performance processing
SELECT * FROM team_performance_bonuses ORDER BY created_at DESC LIMIT 10;

-- Check wallet history
SELECT * FROM wallet_histories WHERE reason LIKE '%bonus%' ORDER BY created_at DESC LIMIT 20;
```

## Important Notes

1. **Only Active Users**: Only users with `isActive = true` are processed
2. **Automatic Execution**: No manual intervention required once cron is set up
3. **Error Handling**: If a user fails, processing continues for other users
4. **Wallet Balance**: All bonuses credit to `wallet_balance`, not BV
5. **Carry Forward**: Team performance bonus maintains carry forward across cycles
6. **5000 Limit**: Team performance bonus is capped at 5000 per cycle

## Troubleshooting

### If bonuses are not processing:
1. Verify cron job is running: `crontab -l`
2. Check Laravel scheduler: `php artisan schedule:list`
3. Test command manually: `php artisan bonuses:process-monthly`
4. Check logs: `storage/logs/laravel.log`

### If specific users are skipped:
- Verify user `isActive` status
- Check if user meets minimum requirements (team structure)
- Review error logs for that specific user
