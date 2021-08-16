import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/RegisterValidator'
import User from 'App/Models/User'

export default class AuthController {
    // public async showLogin ({view}:HttpContextContract){
    //     return await view.render('auth/login')
    // }
    public async register({ request, auth, response }: HttpContextContract) {
        const validateData = await request.validate(RegisterValidator)

        const user = await User.create(validateData)

        const token = await auth.login(user)

        return response.ok({data: token})
    }
    public async login({ request, auth, response }: HttpContextContract) {
        const { email, password } = request.all()

        try {
            const token = await auth.attempt(email, password)

            return response.ok({data: token})
        }   catch (error){
            return response.badRequest({message: 'We could not find user'})
        }
    }
}
