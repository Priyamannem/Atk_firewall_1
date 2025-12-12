import asyncio
import asyncpg

async def create_db():
    try:
        # Connect to 'postgres' system db to create the new db
        conn = await asyncpg.connect(user='postgres', password='root', database='postgres', host='localhost')
        # Check if exists first to avoid error? CREATE DATABASE cannot run inside transaction block
        # asyncpg defaults to auto-commit off? No, individual execute is usually fine unless in transaction.
        # But CREATE DATABASE cannot be in transaction. execute() in asyncpg might implicitly be in one?
        # No, plain execute is fine, but we might need to set isolation level.
        # Actually asyncpg connection is not in transaction by default.
        
        # Check if db exists
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'firewall_db'")
        if not exists:
            await conn.execute('CREATE DATABASE firewall_db')
            print("Database firewall_db created successfully.")
        else:
            print("Database firewall_db already exists.")
            
        await conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    asyncio.run(create_db())
