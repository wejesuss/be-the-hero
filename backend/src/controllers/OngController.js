const crypto = require('crypto')

const connection = require('../database/connection')

module.exports = {
    async index(req, res) {
        const ongs = await connection('ongs').select('*')
    
        return res.json({ ongs })
    },
    async create(req, res) {
        const { name, email, whatsapp, city, uf } = req.body
    
        const id = crypto.randomBytes(4).toString('hex')
    
        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        })
    
        return res.json({ id })
    },
    async delete(req, res) {
        const ongs = await connection('ongs').delete().from('ongs').where('id', '03cc2a0b')
    
        return res.json({ ongs })
    }
}