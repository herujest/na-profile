# Nginx Configuration for File Upload Fix

## Problem
Getting `413 Request Entity Too Large` error when uploading files. This happens because nginx has a default limit of 1MB for request body size.

## Solution

### Step 1: Copy the nginx configuration

On your VPS, copy the `nginx.conf` file to the nginx sites-available directory:

```bash
# On your VPS
sudo cp /path/to/na-profile/nginx.conf /etc/nginx/sites-available/nisaaulia.com
```

### Step 2: Create symlink (if not already exists)

```bash
sudo ln -sf /etc/nginx/sites-available/nisaaulia.com /etc/nginx/sites-enabled/nisaaulia.com
```

### Step 3: Test nginx configuration

```bash
sudo nginx -t
```

If the test passes, you should see:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 4: Reload nginx

```bash
sudo systemctl reload nginx
# Or
sudo service nginx reload
```

### Step 5: Verify the fix

Try uploading a file again. The error should be resolved.

## Alternative: Quick Fix (Edit Existing Config)

If you already have an nginx configuration file, you can just add these lines to your existing server block:

```nginx
# Add these lines inside your server { } block
client_max_body_size 50M;
client_body_timeout 300s;
client_header_timeout 300s;
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
send_timeout 300s;
client_body_buffer_size 128k;
```

Then test and reload:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Adjusting Upload Size Limit

If you need a different size limit, change the `client_max_body_size` value in the nginx config:

- `10M` = 10 megabytes
- `50M` = 50 megabytes  
- `100M` = 100 megabytes
- `500M` = 500 megabytes
- `1G` = 1 gigabyte

**Note:** Make sure your Next.js application and server resources can handle the file sizes you allow.

## Troubleshooting

### If nginx test fails:
- Check the error message from `sudo nginx -t`
- Make sure you're editing the correct server block
- Verify the proxy_pass URL matches your application port (5175)

### If uploads still fail:
1. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
2. Verify the application is running on port 5175: `netstat -tulpn | grep 5175`
3. Check application logs for any errors

### If you're using Docker:
Make sure the nginx configuration points to the correct Docker container or host:
- If nginx is on the host: `proxy_pass http://localhost:5175;`
- If nginx is in Docker: `proxy_pass http://nisa-profile:5175;` (use container name)

## Security Note

Allowing large file uploads can be a security risk. Consider:
- Implementing file type validation
- Setting reasonable size limits
- Using rate limiting for upload endpoints
- Scanning uploaded files for malware

