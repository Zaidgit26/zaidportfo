import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS

  if (!emailUser || !emailPass) {
    throw new Error('SMTP credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env.local')
  }

  console.log('Creating SMTP transporter for:', emailUser)

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    // Additional options for better reliability
    tls: {
      rejectUnauthorized: false
    },
    // Enable debug logs only in development
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
    // Connection timeout for Vercel
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 15000 // 15 seconds
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // For now, we'll use a simple email forwarding service
    // In production, you would use a service like SendGrid, Nodemailer with SMTP, etc.
    
    // Create email content
    const emailContent = {
      to: 'reachme.zaid@gmail.com',
      from: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #555; margin-bottom: 5px;">Contact Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; border-radius: 5px;">
                <p style="margin: 0; line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
              <p>This email was sent from your portfolio contact form.</p>
              <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        Sent at: ${new Date().toLocaleString()}
      `
    }

    // Try to send email using Nodemailer SMTP
    try {
      console.log('Attempting to send email via SMTP...')
      const transporter = createTransporter()

      // Verify SMTP connection
      await transporter.verify()
      console.log('SMTP connection verified successfully')

      // Send mail with defined transport object
      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
        to: 'reachme.zaid@gmail.com',
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        text: emailContent.text,
        html: emailContent.html,
      }

      console.log('Sending email with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        replyTo: mailOptions.replyTo
      })

      const info = await transporter.sendMail(mailOptions)

      console.log('✅ Email sent successfully!')
      console.log('Message ID:', info.messageId)
      console.log('Response:', info.response)

      return NextResponse.json(
        {
          success: true,
          message: 'Message sent successfully! I will get back to you soon.',
          messageId: info.messageId
        },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('❌ SMTP Email sending failed:', emailError)

      // Provide specific error messages
      let errorMessage = 'Failed to send email via SMTP'
      if (emailError instanceof Error) {
        if (emailError.message.includes('Invalid login')) {
          errorMessage = 'SMTP authentication failed. Please check your Gmail app password.'
        } else if (emailError.message.includes('SMTP credentials not configured')) {
          errorMessage = 'SMTP not configured. Please set up your Gmail credentials.'
        } else {
          errorMessage = `SMTP Error: ${emailError.message}`
        }
      }

      // Fallback: Log the email content for manual processing
      console.log('📧 Email content for manual processing:', emailContent)

      return NextResponse.json(
        {
          success: true,
          message: 'Message received! I will get back to you soon. (Email delivery pending configuration)',
          error: errorMessage,
          fallback: true
        },
        { status: 200 }
      )
    }

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
