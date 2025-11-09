import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">شذى للعطور</h3>
            <p className="text-muted-foreground">عبير الفخامة بين يديك</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-primary">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-primary transition-colors">
                  المتجر
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-primary transition-colors">
                  من نحن
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-primary">التواصل</h4>
            <p className="text-sm text-muted-foreground mb-2">البريد الإلكتروني: mouadharouri@shathat.com</p>
            <p className="text-sm text-muted-foreground">الهاتف: 0623-287221</p>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex justify-center items-center text-sm text-muted-foreground">
          <Heart size={16} className="text-accent mx-1" />
          <span>جميع الحقوق محفوظة لشذى للعطور © 2025</span>
        </div>
      </div>
    </footer>
  )
}
