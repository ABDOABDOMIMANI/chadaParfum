"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Award, Users, Heart, Sparkles } from "lucide-react"

export default function About() {
  const teamMembers = [
    { name: "فاطمة الدعيجي", role: "المؤسسة والمديرة التنفيذية", image: "/professional-woman.png" },
    { name: "محمد السهلي", role: "مدير المنتجات", image: "/professional-man.png" },
    { name: "سارة المشاري", role: "مدير العملاء", image: "/professional-woman.png" },
    { name: "أحمد الخريجي", role: "خبير العطور", image: "/professional-man.png" },
  ]

  const testimonials = [
    {
      name: "ليلى محمود",
      role: "عميلة",
      comment: "أفضل متجر عطور تعاملت معه، الجودة والخدمة ممتازة جداً!",
      image: "/diverse-woman-portrait.png",
    },
    {
      name: "عمر السعيد",
      role: "عميل",
      comment: "عطورهم أصلية وفاخرة، والأسعار معقولة جداً، أنصح به.",
      image: "/man.jpg",
    },
    {
      name: "نورا الهاشمي",
      role: "عميلة",
      comment: "الخدمة السريعة والتغليف الفاخر يعكس اهتمام المتجر بالتفاصيل.",
      image: "/diverse-woman-portrait.png",
    },
  ]

  const values = [
    { icon: Award, title: "الجودة", description: "نختار فقط أفضل العطور الأصلية والفاخرة" },
    { icon: Sparkles, title: "الفخامة", description: "تجربة تسوق فاخرة في كل تفاصيل" },
    { icon: Heart, title: "الاحترام", description: "نقدر ذوق وخصوصية عملائنا الكرام" },
    { icon: Users, title: "التعاون", description: "فريق محترف ملتزم بخدمة أفضل" },
  ]

  const timeline = [
    { year: 2014, event: "تأسيس شذى للعطور برؤية واضحة" },
    { year: 2016, event: "افتتاح أول فرع في الرياض" },
    { year: 2018, event: "توسع إلى عدة مدن في المملكة" },
    { year: 2020, event: "انطلاق المتجر الإلكتروني" },
    { year: 2023, event: "تجاوز 10,000 عميل راضي" },
    { year: 2025, event: "أفضل متجر عطور في الشرق الأوسط" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-primary mb-4">من نحن</h1>
            <p className="text-2xl text-muted-foreground mb-4">قصة العطر والفخامة</p>
            <p className="text-lg text-foreground">رحلة عشر سنوات من الالتزام بالجودة والابتكار</p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-12 text-center">قصتنا</h2>
            <div className="space-y-6">
              <div className="p-8 bg-secondary rounded-lg border border-border">
                <p className="text-lg text-foreground leading-relaxed">
                  شذى للعطور تأسست برؤية واضحة: إحضار أرقى العطور الفاخرة من جميع أنحاء العالم إلى عتبة بابك. نؤمن أن
                  العطر ليس مجرد رائحة، بل تجربة حسية فريدة تعكس شخصيتك وذوقك الراقي.
                </p>
              </div>
              <div className="p-8 bg-secondary rounded-lg border border-border">
                <p className="text-lg text-foreground leading-relaxed">
                  منذ تأسيسنا قبل عشر سنوات، التزمنا بتقديم أفضل جودة وخدمة استثنائية لعملائنا الكرام. كل عطر في متجرنا
                  يختار بعناية فائقة من أفضل العطارين والماركات العالمية.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-12 text-center">قيمنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <div key={value.title} className="text-center p-6 bg-card rounded-lg border border-border">
                    <Icon size={40} className="text-accent mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-12 text-center">رحلتنا</h2>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-6 p-6 bg-secondary rounded-lg border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-24 font-bold text-2xl text-primary">{item.year}</div>
                  <div className="flex-1 flex items-center">
                    <p className="text-lg text-foreground">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-12 text-center">فريقنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="text-center p-6 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow"
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover bg-muted"
                  />
                  <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-8 bg-card rounded-lg border border-border">
                <div className="text-5xl font-bold text-accent mb-2">10+</div>
                <p className="text-foreground font-semibold">سنوات من الخبرة</p>
              </div>
              <div className="text-center p-8 bg-card rounded-lg border border-border">
                <div className="text-5xl font-bold text-accent mb-2">10,000+</div>
                <p className="text-foreground font-semibold">عميل راضي</p>
              </div>
              <div className="text-center p-8 bg-card rounded-lg border border-border">
                <div className="text-5xl font-bold text-accent mb-2">100+</div>
                <p className="text-foreground font-semibold">عطر فاخر</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-12 text-center">آراء عملائنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-6 bg-card rounded-lg border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover bg-muted"
                    />
                    <div>
                      <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-foreground italic">{testimonial.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">انضم إلى عائلتنا</h2>
            <p className="text-xl opacity-90 mb-8">استكشف عالماً من العطور الفاخرة واستمتع بتجربة تسوق استثنائية</p>
            <a
              href="/shop"
              className="inline-block px-10 py-3 bg-primary-foreground text-primary rounded-lg hover:opacity-90 transition-opacity font-semibold text-lg"
            >
              اكتشف مجموعتنا
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
