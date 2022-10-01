import bcrypt from 'bcrypt'

const HashPassword = async (plaintTextPassword: string): Promise<string>=>{
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(plaintTextPassword, salt)

    return hashedPassword
}

const CompareHashedPasswords = async (providedPassword: string, actualPassword: string): Promise<boolean>=>{
    const isSame = await bcrypt.compare(providedPassword, actualPassword)

    return isSame
}

export {HashPassword, CompareHashedPasswords}