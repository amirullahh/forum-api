-- Create developer user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'developer') THEN
        CREATE USER developer WITH PASSWORD 'supersecretpassword';
    END IF;
END
$$;

-- Grant privileges to developer
ALTER USER developer CREATEDB;

-- Create databases
DROP DATABASE IF EXISTS forumapi;
DROP DATABASE IF EXISTS forumapi_test;

CREATE DATABASE forumapi OWNER developer;
CREATE DATABASE forumapi_test OWNER developer;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE forumapi TO developer;
GRANT ALL PRIVILEGES ON DATABASE forumapi_test TO developer;
