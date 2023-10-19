import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

export default class FreteController{

    public async calc({ request, response}: HttpContextContract){
        try {
            const {
                cepOrigem,
                cepDestino,
                peso,
                altura,
                largura,
                profundidade
            } = request.body()
    
           const frete = await axios.post(`https://www.cepcerto.com/ws/json-frete/${cepOrigem}/${cepDestino}/${peso}/${altura}/${largura}/${profundidade}`)
            
           
           return {
            message: response.status(200).response.statusCode,
            frete: frete.data
        }
        } catch (error) {
            console.log('error frete', error)
            return response.status(500)
        } 
    }    
}