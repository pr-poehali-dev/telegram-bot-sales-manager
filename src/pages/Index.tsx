import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const { toast } = useToast();

  const services = [
    {
      icon: "User",
      title: "Аватарки",
      description: "Создание уникальных аватаров для социальных сетей и профилей",
      color: "bg-purple-500"
    },
    {
      icon: "Globe",
      title: "Сайты под ключ",
      description: "Полный цикл разработки современных веб-сайтов",
      color: "bg-blue-500"
    },
    {
      icon: "ShoppingBag",
      title: "Карточки товаров",
      description: "Профессиональный дизайн карточек для маркетплейсов",
      color: "bg-cyan-500"
    }
  ];

  const portfolio = [
    {
      image: "https://cdn.poehali.dev/projects/e43f02a7-9df6-442d-b336-15b11d867227/files/46247b2a-470a-4a97-a5dc-7ab933acef6a.jpg",
      title: "Аватар для игрового профиля",
      category: "Аватарки"
    },
    {
      image: "https://cdn.poehali.dev/projects/e43f02a7-9df6-442d-b336-15b11d867227/files/97970f59-65f2-461b-a01b-48b62bd1d811.jpg",
      title: "Корпоративный сайт студии",
      category: "Сайты"
    },
    {
      image: "https://cdn.poehali.dev/projects/e43f02a7-9df6-442d-b336-15b11d867227/files/0f7133dc-21e2-4ff5-bdcb-6d82e726feff.jpg",
      title: "Карточка товара для Wildberries",
      category: "Карточки товаров"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Sparkles" className="text-white" size={20} />
              </div>
              <span className="text-xl font-display font-bold">CardCraft STUDIO</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">Услуги</a>
              <a href="#portfolio" className="text-sm font-medium hover:text-primary transition-colors">Портфолио</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
            </div>
            <Button className="hidden md:flex">Заказать проект</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Icon name="Menu" size={20} />
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Icon name="Zap" size={14} className="mr-1" />
                Креативная студия
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
                Создаём дизайн, который
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> продаёт</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Разрабатываем аватарки, сайты под ключ и карточки товаров для маркетплейсов. 
                Современный дизайн, который привлекает клиентов.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-base">
                  <Icon name="MessageCircle" size={18} className="mr-2" />
                  Обсудить проект
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  <Icon name="Briefcase" size={18} className="mr-2" />
                  Посмотреть работы
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold font-display">200+</div>
                  <div className="text-sm text-muted-foreground">Проектов</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div>
                  <div className="text-3xl font-bold font-display">150+</div>
                  <div className="text-sm text-muted-foreground">Клиентов</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div>
                  <div className="text-3xl font-bold font-display">5+</div>
                  <div className="text-sm text-muted-foreground">Лет опыта</div>
                </div>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <img 
                src="https://cdn.poehali.dev/projects/e43f02a7-9df6-442d-b336-15b11d867227/files/97970f59-65f2-461b-a01b-48b62bd1d811.jpg"
                alt="CardCraft Studio Workspace"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <Badge className="mb-4">Наши услуги</Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Что мы делаем лучше всех
            </h2>
            <p className="text-muted-foreground text-lg">
              Предоставляем полный спектр услуг по созданию визуального контента для вашего бизнеса
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6`}>
                  <Icon name={service.icon as any} className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <Button variant="ghost" className="mt-6 p-0 h-auto font-medium text-primary hover:bg-transparent">
                  Узнать больше
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <Badge className="mb-4">Портфолио</Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Наши последние работы
            </h2>
            <p className="text-muted-foreground text-lg">
              Каждый проект — это история успеха наших клиентов
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((item, index) => (
              <Card 
                key={index} 
                className="overflow-hidden group cursor-pointer border-2 hover:shadow-xl transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                  <h3 className="text-xl font-display font-semibold">{item.title}</h3>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Смотреть все проекты
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <Badge>Почему мы?</Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Делаем работу качественно и в срок
              </h2>
              <div className="space-y-4">
                {[
                  { icon: "Zap", title: "Быстро", desc: "Сдаём проекты точно в срок" },
                  { icon: "Award", title: "Качественно", desc: "Работаем с вниманием к деталям" },
                  { icon: "Users", title: "Индивидуально", desc: "Учитываем все ваши пожелания" },
                  { icon: "TrendingUp", title: "Эффективно", desc: "Дизайн, который приносит результат" }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as any} className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8 md:p-12 border-2 shadow-xl animate-scale-in">
              <div className="mb-6">
                <h3 className="text-3xl font-display font-bold mb-2">Готовы начать?</h3>
                <p className="text-muted-foreground">Расскажите о вашем проекте, и мы свяжемся с вами</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input 
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <Input 
                    type="email"
                    placeholder="Email или Telegram"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder="Расскажите о вашем проекте"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    className="min-h-[120px] resize-none"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base">
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить заявку
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Sparkles" className="text-white" size={20} />
                </div>
                <span className="text-xl font-display font-bold">CardCraft</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Создаём дизайн, который продаёт
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Аватарки</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Сайты под ключ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Карточки товаров</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Портфолио</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>info@cardcraft.ru</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>+7 (999) 123-45-67</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 CardCraft STUDIO. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
