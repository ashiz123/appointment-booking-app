import '../setup/setup.js';

// Test suite for user operations
describe('User operations', () => {
    const usersCollection = () => global.db.collection('users');
    let insertedIds = [];

    afterEach(async () => {
        if (insertedIds.length > 0) {
            await usersCollection().deleteMany({ _id: { $in: insertedIds } });
            insertedIds = [];
        }
    });

    test('should insert a new user into the users collection', async () => {
        const newUser = { username: 'John Doe', email: 'john@gmail.com', password: 'hashedpassword' };
        const result = await usersCollection().insertOne(newUser);
        
        expect(result.acknowledged).toBe(true);
        expect(result.insertedId).toBeDefined();
        
        insertedIds.push(result.insertedId);
    });

    test('should find an inserted user in the users collection', async () => {
        const newUser = { username: 'Jane Doe', email: 'jane@gmail.com', password: 'password123' };
        const result = await usersCollection().insertOne(newUser);
        insertedIds.push(result.insertedId);

        const insertedUser = await usersCollection().findOne({ _id: result.insertedId });
        
        expect(insertedUser).toBeDefined();
        expect(insertedUser.username).toBe('Jane Doe');
        expect(insertedUser.email).toBe('jane@gmail.com');
    });


    

})
