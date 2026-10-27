import jwt from "jsonwebtoken"

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
}

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      })

      res.cookie("adminToken", token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.json({ success: true, message: "Admin Logged in" })
    }

    return res.json({ success: false, message: "Invalid Credentials" })
  } catch (error) {
    console.log(error.message)
    return res.json({ success: false, message: error.message })
  }
}

export const isAdminAuth = async (req, res) => {
    try {
        const adminEmail = req.adminEmail || process.env.ADMIN_EMAIL

        if (!adminEmail || adminEmail !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not Authorized Login again" })
        }

        return res.json({ success: true, user: { email: adminEmail } })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}

export const adminLogout = async (req, res) => {
    try {
        res.clearCookie("adminToken", cookieOptions)
        return res.json({ success: true, message: "Admin Logged out" })
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false, message: error.message })
    }
}
