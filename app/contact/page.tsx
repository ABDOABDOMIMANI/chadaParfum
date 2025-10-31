"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const faqs = [
    {
      question: "هل العطور أصلية؟",
      answer: "نعم، جميع عطورنا أصلية 100% ومستوردة من الشركات المرخصة. نضمن الأصالة في كل زجاجة.",
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل جميع بطاقات الائتمان والحوالات البنكية والدفع عند الاستلام، بالإضافة إلى المحافظ الرقمية.",
    },
    {
      question: "كم تستغرق فترة الشحن؟",
      answer: "يتم الشحن خلال 1-2 يوم عمل داخل الرياض، و3-5 أيام عمل للمدن الأخرى.",
    },
    {
      question: "هل يمكنني استرجاع المنتج؟",
      answer: "نعم، يمكنك استرجاع المنتج خلال 14 يوم من الشراء إذا كان غير مفتوح الختم.",
    },
    {
      question: "كيف أختار العطر المناسب؟",
      answer: "يمكنك تصفح أقسام العطور المختلفة أو التواصل مع فريقنا للحصول على استشارة شخصية.",
    },
    {
      question: "هل توجد عروض وخصومات؟",
      answer: "نعم، لدينا عروض مستمرة وبرنامج ولاء للعملاء الدائمين. تابع متجرنا للعروض الجديدة.",
    },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-background">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-4">اتصل بنا</h1>
          <p className="text-xl text-muted-foreground">نحن هنا للإجابة على جميع أسئلتك والاستماع إلى ملاحظاتك</p>
        </section>

        <div className="max-w-7xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <Phone className="text-accent mx-auto mb-4" size={32} />
              <h3 className="font-semibold text-primary mb-2">الهاتف</h3>
              <p className="text-sm text-muted-foreground">
                <a href="tel:+0623267221" className="hover:text-primary">
                  0623267221
                </a>
              </p>
             
            </div>

            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <Mail className="text-accent mx-auto mb-4" size={32} />
              <h3 className="font-semibold text-primary mb-2">البريد الإلكتروني</h3>
              <p className="text-sm text-muted-foreground">
                <a href="mailto:info@shathat.com" className="hover:text-primary">
                  mouadharouri@shathat.com
                </a>
              </p>
             
            </div>

            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <MapPin className="text-accent mx-auto mb-4" size={32} />
              <h3 className="font-semibold text-primary mb-2">العنوان</h3>
              <p className="text-sm text-muted-foreground">الرياض - المملكة العربية السعودية</p>
              <p className="text-sm text-muted-foreground">حي النرجس، شارع الملك فهد</p>
            </div>

            <div className="p-6 bg-secondary rounded-lg border border-border text-center">
              <Clock className="text-accent mx-auto mb-4" size={32} />
              <h3 className="font-semibold text-primary mb-2">أوقات العمل</h3>
              <p className="text-sm text-muted-foreground">السبت - الخميس</p>
              <p className="text-sm text-muted-foreground">9:00 ص - 10:00 م</p>
            </div>
          </div>

          {/* Contact Form & Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">أرسل لنا رسالة</h2>
              {submitted && (
                <div className="mb-6 p-4 bg-accent/10 border border-accent text-accent-foreground rounded-lg">
                  شكراً! تم استقبال رسالتك بنجاح سنرد عليك قريباً.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">الاسم الكامل</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="بريدك الإلكتروني"
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">الموضوع</label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="موضوع الرسالة"
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">الرسالة</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="أكتب رسالتك هنا..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold">
                  إرسال الرسالة
                </Button>
              </form>
            </div>

            {/* Social & Quick Contact */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">طرق أخرى للتواصل</h2>

              <div className="space-y-6">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/212623287221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <MessageCircle className="text-accent flex-shrink-0" size={32} />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">تحدث معنا عبر واتساب</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@shathat.com"
                  className="flex items-center gap-4 p-6 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <Mail className="text-accent flex-shrink-0" size={32} />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">البريد الإلكتروني</h3>
                    <p className="text-sm text-muted-foreground">info@shathat.com</p>
                  </div>
                </a>

                {/* Phone */}
                

                {/* Location */}
                <a
                  href="https://maps.google.com/?q=marrakech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <MapPin className="text-accent flex-shrink-0" size={32} />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">الموقع</h3>
                    <p className="text-sm text-muted-foreground">مراكش - حي المحاميد</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <iframe
            src="https://www.google.com/maps?q=31.5960063934326,-8.0388298034668&output=embed"
            width="100%"
            height="400px"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />


          {/* FAQ Section */}
          <section className="mb-16 mt-12">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">الأسئلة الشائعة</h2>
            <div className="max-w-3xl mx-auto bg-secondary rounded-lg border border-border p-6">
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-foreground font-semibold hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
