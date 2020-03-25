const connection = require('../database/connection')

module.exports = {
    async index(req, res) {
        const { page = 1 } = req.query

        const ong_id = req.headers.authorization
        const [count] = await connection('incidents').count().where('ong_id', ong_id)
        
        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ])
        .where('ong_id', ong_id)

        res.header('X-Total-Count', count['count(*)'])

        return res.json({ incidents })
    },
    async findOne(req, res) {
        const ong_id = req.headers.authorization
        const { id } = req.params
        
        const incident = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ])
        .where({
            'ong_id': ong_id,
            'incidents.id': id
        }).first()

        return res.json({ incident })
    }

}