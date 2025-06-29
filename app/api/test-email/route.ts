import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Test endpoint to verify SMTP configuration
export async function GET(request: NextRequest) {
  try {
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'SMTP credentials not configured',
          instructions: 'Please set EMAIL_USER and EMAIL_PASS in .env.local'
        },
        { status: 400 }
      )
    }

    console.log('Testing SMTP configuration for:', emailUser)

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Test connection
    await transporter.verify()
    console.log('✅ SMTP connection verified successfully')

    // Send test email
    const testEmail = {
      from: `"Portfolio Test" <${emailUser}>`,
      to: emailUser, // Send to yourself
      subject: 'SMTP Test - Portfolio Contact Form',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #28a745;">✅ SMTP Configuration Test Successful!</h2>
          <p>Your Gmail SMTP is working correctly for the portfolio contact form.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <p><strong>Email:</strong> ${emailUser}</p>
            <p><strong>SMTP Host:</strong> smtp.gmail.com</p>
            <p><strong>Port:</strong> 587</p>
            <p><strong>Security:</strong> STARTTLS</p>
          </div>
          <p>Your contact form is now ready to receive real messages!</p>
          <p><small>Test performed at: ${new Date().toLocaleString()}</small></p>
        </div>
      `,
      text: `
        SMTP Configuration Test Successful!
        
        Your Gmail SMTP is working correctly for the portfolio contact form.
        
        Configuration Details:
        Email: ${emailUser}
        SMTP Host: smtp.gmail.com
        Port: 587
        Security: STARTTLS
        
        Your contact form is now ready to receive real messages!
        
        Test performed at: ${new Date().toLocaleString()}
      `
    }

    const info = await transporter.sendMail(testEmail)
    
    console.log('✅ Test email sent successfully!')
    console.log('Message ID:', info.messageId)

    return NextResponse.json(
      {
        success: true,
        message: 'SMTP test successful! Check your email inbox.',
        details: {
          messageId: info.messageId,
          from: emailUser,
          to: emailUser,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ SMTP test failed:', error)
    
    let errorMessage = 'SMTP test failed'
    let instructions = 'Please check your configuration'
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Authentication failed'
        instructions = 'Please check your Gmail app password in .env.local'
      } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
        errorMessage = 'Network connection failed'
        instructions = 'Please check your internet connection'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        instructions: instructions,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
