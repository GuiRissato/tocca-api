import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
    public async login({ request, response}: HttpContextContract) {
        let {user_name, password} = request.all()
        console.log(user_name,password)
         try {
 
           let user = await User.findBy('user_name',user_name)
 
           if (user) {
             const isPasswordValid = await user.verifyPassword(password)
             if (isPasswordValid){
                 let userFormatted = user.toJSON();
                 delete userFormatted?.password
                 return response.status(200).json({userFormatted});
             }else{
                return response.status(401).json({error: " wrong username or password"})
             }
 
           } else {
             return response.status(401).json({ error: 'Invalid credentials' });
           }
         } catch (e) {
            console.log(e)
           return response.unauthorized('Invalid credentials')
         }
       }
   
    public async index( {response}: HttpContextContract){
        try {
            const users = await User.all();
            return response.status(200).json(users);
          } catch (error) {
            return response.status(500).json({ error: 'Erro ao buscar usuários' });
          }
      }
    
      public async store({ request, response }: HttpContextContract){
        try {
          const body = request.body();
         
          const user = await User.create(body);
      
          response.status(201);
      
          return{
            message: "usuário cadastrado com sucesso!",
            user: user
          }
        } catch (error) {
    
          console.log('store user error', error)
    
        }
      }
    
      public async update({ request, response }: HttpContextContract){
        try {
          const body = request.body()
          // console.log('body', body)
      
          const user = await User.findOrFail(request.params().id)
          // console.log('user',user)
      
          user.name = body.name ? body.name : user.name
          user.password = body.password ? body.password : user.password
          user.user_name = body.email ? body.email : user.user_name
          user.name = body.name ? body.name : user.name
          user.age = body.age ? body.age : user.age      
          await user.save()
      
          response.status(201)
      
          return{
            message: "usuário atualizado com sucesso!",
            user: user
          }
        } catch (error) {
    
          console.log('update user', error)
    
        }
      }
    
      public async destroy({ request, response }: HttpContextContract){
        try {
          const user = await User.findOrFail(request.params().id)
      
          await user.delete()
      
          response.status(200)
      
          return{
             message: "usuario deletado com sucesso!"
          }
        } catch (error) {
    
          console.log('destroy user error', error);
    
        }
      }

}
