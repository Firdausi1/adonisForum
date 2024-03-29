import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	  name: schema.string(),
	  email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email'})]),
	  password: schema.string()
  })

  public messages = {}
}
