import emailjs from '@emailjs/browser'

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_dig9o4w'
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_portfolio_contact'
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface EmailResponse {
  success: boolean
  message: string
  error?: string
}

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY)
    return true
  }
  console.warn('EmailJS not configured - missing environment variables')
  return false
}

// Send email using EmailJS
export const sendEmailViaEmailJS = async (formData: ContactFormData): Promise<EmailResponse> => {
  try {
    // Check if EmailJS is properly configured
    if (!EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS public key not configured. Please add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to your .env.local file.')
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      throw new Error('EmailJS service or template not configured')
    }

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: 'reachme.zaid@gmail.com',
      reply_to: formData.email,
      current_time: new Date().toLocaleString(),
    }

    console.log('Sending email via EmailJS with params:', {
      service: EMAILJS_SERVICE_ID,
      template: EMAILJS_TEMPLATE_ID,
      from: formData.email,
      subject: formData.subject
    })

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('EmailJS response:', response)

    if (response.status === 200) {
      return {
        success: true,
        message: 'Message sent successfully! I will get back to you soon.'
      }
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`)
    }
  } catch (error) {
    console.error('EmailJS error:', error)
    return {
      success: false,
      message: 'Failed to send message via EmailJS',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Send email using API route (fallback)
export const sendEmailViaAPI = async (formData: ContactFormData): Promise<EmailResponse> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Message sent successfully!'
      }
    } else {
      throw new Error(data.error || 'API request failed')
    }
  } catch (error) {
    console.error('API email error:', error)
    return {
      success: false,
      message: 'Failed to send message via API',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Main email sending function with fallback
export const sendEmail = async (formData: ContactFormData): Promise<EmailResponse> => {
  // Validate form data
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    return {
      success: false,
      message: 'All fields are required',
      error: 'Validation failed'
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
      error: 'Invalid email format'
    }
  }

  // Try EmailJS first (more reliable for client-side)
  try {
    const emailJSResult = await sendEmailViaEmailJS(formData)
    if (emailJSResult.success) {
      return emailJSResult
    }
  } catch (error) {
    console.warn('EmailJS failed, trying API fallback:', error)
  }

  // Fallback to API route
  try {
    const apiResult = await sendEmailViaAPI(formData)
    return apiResult
  } catch (error) {
    console.error('Both email methods failed:', error)
    return {
      success: false,
      message: 'Failed to send message. Please try contacting me directly at reachme.zaid@gmail.com',
      error: 'All email methods failed'
    }
  }
}

// Utility function to format email for mailto fallback
export const createMailtoLink = (formData: ContactFormData): string => {
  const subject = encodeURIComponent(`Portfolio Contact: ${formData.subject}`)
  const body = encodeURIComponent(
    `Hi Zaid,\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`
  )
  
  return `mailto:reachme.zaid@gmail.com?subject=${subject}&body=${body}`
}
