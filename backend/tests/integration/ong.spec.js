const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('ONG', () => {
    beforeEach(async () => {
        await connection.migrate.latest()
    })
    
    afterAll(async () => {
        await connection.migrate.rollback()
        await connection.destroy()
    })

    it('should be able to create a new ONG', async () => {
        const response = await request(app)
        .post('/ongs')
        .send({
            name: "SMPA",
            email: "contato2@apad.com",
            whatsapp: "23103020032",
            city: "Belo Horizonte",
            uf: "MG"
        })

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    })
})