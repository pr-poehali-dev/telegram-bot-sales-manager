import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type Screen = 'start' | 'menu' | 'services' | 'portfolio' | 'prices' | 'order' | 'faq' | 'reviews' | 'promo';
type ServiceCategory = 'cards' | 'sites' | 'avatars' | 'other' | null;

const Index = () => {
  const [screen, setScreen] = useState<Screen>('start');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(null);
  const [messages, setMessages] = useState<Array<{ text: string; type: 'bot' | 'user' }>>([]);
  const [orderStep, setOrderStep] = useState(0);
  const [orderData, setOrderData] = useState({
    service: '',
    link: '',
    audience: '',
    advantages: '',
    references: '',
    deadline: '',
    tariff: ''
  });
  const { toast } = useToast();

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { text, type: 'bot' }]);
  };

  const handleStart = () => {
    setScreen('menu');
    addBotMessage('🎨 Главное меню открыто! Выбирайте интересующий раздел:');
  };

  const handleServiceSelect = (category: ServiceCategory, serviceName: string) => {
    setServiceCategory(category);
    setOrderData({ ...orderData, service: serviceName });
    setScreen('order');
    setOrderStep(0);
    addBotMessage(`Отлично! Вы выбрали: ${serviceName}. Давайте заполним бриф:`);
  };

  const handleOrderNext = () => {
    if (orderStep < 5) {
      setOrderStep(orderStep + 1);
    } else {
      const orderId = Math.floor(Math.random() * 100000);
      toast({
        title: "🎉 Заказ оформлен!",
        description: `Номер заказа: #${orderId}. Мы свяжемся с вами в Telegram.`,
      });
      setScreen('menu');
      setOrderStep(0);
      addBotMessage(`✅ Заказ #${orderId} создан! Менеджер свяжется с вами в течение 1 часа.`);
    }
  };

  const services = {
    cards: [
      { icon: '🎨', name: 'Дизайн карточки товара', desc: 'Основное + доп. фото, инфографика' },
      { icon: '✍️', name: 'Тексты для карточки', desc: 'SEO-заголовок, описание, выгоды' },
      { icon: '⭐', name: 'A+ контент / EBC', desc: 'Премиум-блоки с галереями' },
      { icon: '🎁', name: 'Пакет "Под ключ"', desc: 'Дизайн + текст + аудит' }
    ],
    sites: [
      { icon: '🚀', name: 'Лендинг для товара', desc: 'Продающая страница' },
      { icon: '🛒', name: 'Интернет-магазин', desc: 'С интеграцией маркетплейсов' }
    ],
    avatars: [
      { icon: '👤', name: 'Аватарки для соцсетей', desc: 'Пакет 3-5 вариантов' },
      { icon: '🎯', name: 'Логотип', desc: 'Уникальный дизайн' },
      { icon: '📘', name: 'Гайдлайн бренда', desc: 'Палитра, шрифты, стиль' }
    ],
    other: [
      { icon: '📢', name: 'Баннеры для рекламы', desc: 'Яндекс.Директ, ВК' },
      { icon: '📱', name: 'Оформление соцсетей', desc: 'Шапка, обложки' },
      { icon: '📊', name: 'Презентации', desc: 'Для инвесторов, клиентов' }
    ]
  };

  const tariffs = [
    { name: 'Базовый', price: '5 000 ₽', features: ['1 вариант', '3 правки', '5 дней'], color: 'bg-primary' },
    { name: 'Про', price: '12 000 ₽', features: ['3 варианта', '5 правок', '3 дня', 'A+ контент'], color: 'bg-secondary' },
    { name: 'Всё включено', price: '25 000 ₽', features: ['5 вариантов', 'Безлимит правок', '2 дня', 'Аудит конкурентов'], color: 'bg-accent' }
  ];

  const portfolio = [
    { title: 'Карточка чайника Redmond', result: '+180% просмотров', before: '50 просмотров/день', after: '140 просмотров/день' },
    { title: 'Лендинг для косметики', result: '+65% конверсия', before: '2.3% конверсия', after: '3.8% конверсия' },
    { title: 'A+ контент для кроссовок', result: '+220% продаж', before: '15 продаж/неделя', after: '48 продаж/неделя' }
  ];

  const orderSteps = [
    { label: 'Ссылка на товар/аналог', field: 'link', placeholder: 'https://www.wildberries.ru/catalog/...' },
    { label: 'Кто ваша целевая аудитория?', field: 'audience', placeholder: 'Например: женщины 25-40 лет, молодые мамы' },
    { label: 'Ключевые преимущества товара (3 пункта)', field: 'advantages', placeholder: '1. Экологичный\n2. Долговечный\n3. Удобный' },
    { label: 'Референсы (что нравится)', field: 'references', placeholder: 'Ссылки на примеры или описание стиля' },
    { label: 'Дедлайн', field: 'deadline', placeholder: 'Например: 7 дней' },
    { label: 'Выберите тариф', field: 'tariff', type: 'select' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-2xl overflow-hidden border-4 border-primary/20 animate-scale-in">
          <div className="bg-gradient-to-r from-primary via-secondary to-accent p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon name="Sparkles" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-lg">CreativeBot</h1>
                <p className="text-xs text-white/80">Ваш менеджер по продажам</p>
              </div>
            </div>
          </div>

          <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-purple-50/30">
            {screen === 'start' && (
              <div className="animate-fade-in space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl animate-bounce">🎨</div>
                  <h2 className="text-2xl font-bold text-primary font-handwritten">
                    Привет! Мы создаём крутой дизайн
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Разрабатываем карточки для маркетплейсов, сайты, аватарки и многое другое!
                  </p>
                  <Badge className="bg-secondary text-white text-base px-4 py-2 animate-pulse">
                    🎁 Скидка 10% на первый заказ
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button onClick={handleStart} className="h-auto py-4 flex-col gap-2 bg-primary hover:bg-primary/90">
                    <Icon name="Play" size={24} />
                    <span className="text-sm">Начать</span>
                  </Button>
                  <Button onClick={() => setScreen('promo')} variant="outline" className="h-auto py-4 flex-col gap-2 border-2 border-secondary text-secondary hover:bg-secondary/10">
                    <Icon name="Gift" size={24} />
                    <span className="text-sm">Акция</span>
                  </Button>
                  <Button onClick={() => setScreen('portfolio')} variant="outline" className="h-auto py-4 flex-col gap-2 border-2 border-accent text-accent hover:bg-accent/10">
                    <Icon name="Briefcase" size={24} />
                    <span className="text-sm">Портфолио</span>
                  </Button>
                  <Button onClick={() => setScreen('reviews')} variant="outline" className="h-auto py-4 flex-col gap-2 border-2 border-primary text-primary hover:bg-primary/10">
                    <Icon name="Star" size={24} />
                    <span className="text-sm">Отзывы</span>
                  </Button>
                </div>
              </div>
            )}

            {screen === 'menu' && (
              <div className="animate-slide-up space-y-4">
                <Button onClick={() => setScreen('services')} className="w-full justify-between h-auto py-4 bg-gradient-to-r from-primary to-secondary text-white">
                  <div className="flex items-center gap-3">
                    <Icon name="Sparkles" size={20} />
                    <span className="font-semibold">Услуги</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </Button>

                <Button onClick={() => setScreen('portfolio')} variant="outline" className="w-full justify-between h-auto py-4 border-2">
                  <div className="flex items-center gap-3">
                    <Icon name="Briefcase" size={20} />
                    <span className="font-semibold">Портфолио</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </Button>

                <Button onClick={() => setScreen('prices')} variant="outline" className="w-full justify-between h-auto py-4 border-2">
                  <div className="flex items-center gap-3">
                    <Icon name="DollarSign" size={20} />
                    <span className="font-semibold">Цены</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </Button>

                <Button onClick={() => setScreen('faq')} variant="outline" className="w-full justify-between h-auto py-4 border-2">
                  <div className="flex items-center gap-3">
                    <Icon name="HelpCircle" size={20} />
                    <span className="font-semibold">FAQ</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </Button>

                <Button onClick={() => setScreen('reviews')} variant="outline" className="w-full justify-between h-auto py-4 border-2">
                  <div className="flex items-center gap-3">
                    <Icon name="MessageCircle" size={20} />
                    <span className="font-semibold">Отзывы</span>
                  </div>
                  <Icon name="ChevronRight" size={20} />
                </Button>

                <div className="pt-4">
                  <Button onClick={() => setScreen('start')} variant="ghost" className="w-full">
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                </div>
              </div>
            )}

            {screen === 'services' && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-xl font-bold text-center font-handwritten text-primary">Выберите категорию услуг</h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground px-2">📦 Карточки товара</h4>
                    {services.cards.map((service, i) => (
                      <Button
                        key={i}
                        onClick={() => handleServiceSelect('cards', service.name)}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary transition-all"
                      >
                        <div className="text-left space-y-1">
                          <div className="font-semibold flex items-center gap-2">
                            <span>{service.icon}</span>
                            <span className="text-sm">{service.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{service.desc}</p>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground px-2">🌐 Сайты</h4>
                    {services.sites.map((service, i) => (
                      <Button
                        key={i}
                        onClick={() => handleServiceSelect('sites', service.name)}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 hover:bg-secondary/5 hover:border-secondary transition-all"
                      >
                        <div className="text-left space-y-1">
                          <div className="font-semibold flex items-center gap-2">
                            <span>{service.icon}</span>
                            <span className="text-sm">{service.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{service.desc}</p>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground px-2">🎨 Brand Identity</h4>
                    {services.avatars.map((service, i) => (
                      <Button
                        key={i}
                        onClick={() => handleServiceSelect('avatars', service.name)}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 hover:bg-accent/5 hover:border-accent transition-all"
                      >
                        <div className="text-left space-y-1">
                          <div className="font-semibold flex items-center gap-2">
                            <span>{service.icon}</span>
                            <span className="text-sm">{service.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{service.desc}</p>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground px-2">✨ Дополнительно</h4>
                    {services.other.map((service, i) => (
                      <Button
                        key={i}
                        onClick={() => handleServiceSelect('other', service.name)}
                        variant="outline"
                        className="w-full justify-start h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary transition-all"
                      >
                        <div className="text-left space-y-1">
                          <div className="font-semibold flex items-center gap-2">
                            <span>{service.icon}</span>
                            <span className="text-sm">{service.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{service.desc}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setScreen('menu')} variant="ghost" className="w-full">
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад
                </Button>
              </div>
            )}

            {screen === 'portfolio' && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-2xl font-bold text-center font-handwritten text-primary">Наши кейсы</h3>
                <p className="text-center text-muted-foreground text-sm">Результаты говорят сами за себя</p>

                {portfolio.map((item, i) => (
                  <Card key={i} className="p-4 border-2 hover:border-primary transition-all hover:shadow-lg">
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <Badge className="bg-green-500 text-white mb-3">{item.result}</Badge>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-red-600">
                        <Icon name="TrendingDown" size={16} />
                        <span>Было: {item.before}</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <Icon name="TrendingUp" size={16} />
                        <span>Стало: {item.after}</span>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button onClick={() => setScreen(screen === 'portfolio' ? 'menu' : 'start')} variant="ghost" className="w-full">
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад
                </Button>
              </div>
            )}

            {screen === 'prices' && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-2xl font-bold text-center font-handwritten text-primary">Тарифы</h3>

                {tariffs.map((tariff, i) => (
                  <Card key={i} className={`p-5 border-2 hover:shadow-xl transition-all ${i === 1 ? 'ring-2 ring-secondary' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-lg">{tariff.name}</h4>
                      {i === 1 && <Badge className="bg-secondary">Популярный</Badge>}
                    </div>
                    <p className="text-3xl font-bold text-primary mb-4">{tariff.price}</p>
                    <ul className="space-y-2">
                      {tariff.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <Icon name="CheckCircle2" size={16} className="text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}

                <Button onClick={() => setScreen('menu')} variant="ghost" className="w-full">
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад
                </Button>
              </div>
            )}

            {screen === 'order' && (
              <div className="animate-fade-in space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold font-handwritten text-primary">Оформление заказа</h3>
                  <p className="text-sm text-muted-foreground">Шаг {orderStep + 1} из 6</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((orderStep + 1) / 6) * 100}%` }}></div>
                  </div>
                </div>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <p className="text-sm font-semibold mb-1">Выбранная услуга:</p>
                  <p className="text-primary font-bold">{orderData.service}</p>
                </Card>

                {orderSteps[orderStep].type === 'select' ? (
                  <div className="space-y-3">
                    <p className="font-semibold">{orderSteps[orderStep].label}</p>
                    {tariffs.map((tariff, i) => (
                      <Button
                        key={i}
                        onClick={() => {
                          setOrderData({ ...orderData, tariff: tariff.name });
                        }}
                        variant={orderData.tariff === tariff.name ? "default" : "outline"}
                        className="w-full h-auto py-3 justify-between"
                      >
                        <span>{tariff.name}</span>
                        <span className="font-bold">{tariff.price}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="font-semibold text-sm">{orderSteps[orderStep].label}</label>
                    {orderStep === 2 ? (
                      <Textarea
                        placeholder={orderSteps[orderStep].placeholder}
                        value={orderData[orderSteps[orderStep].field as keyof typeof orderData]}
                        onChange={(e) => setOrderData({ ...orderData, [orderSteps[orderStep].field]: e.target.value })}
                        rows={5}
                        className="border-2"
                      />
                    ) : (
                      <Input
                        placeholder={orderSteps[orderStep].placeholder}
                        value={orderData[orderSteps[orderStep].field as keyof typeof orderData]}
                        onChange={(e) => setOrderData({ ...orderData, [orderSteps[orderStep].field]: e.target.value })}
                        className="border-2"
                      />
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {orderStep > 0 && (
                    <Button onClick={() => setOrderStep(orderStep - 1)} variant="outline" className="flex-1">
                      <Icon name="ArrowLeft" size={16} className="mr-2" />
                      Назад
                    </Button>
                  )}
                  <Button onClick={handleOrderNext} className="flex-1 bg-primary">
                    {orderStep === 5 ? (
                      <>
                        <Icon name="Check" size={16} className="mr-2" />
                        Отправить
                      </>
                    ) : (
                      <>
                        Далее
                        <Icon name="ArrowRight" size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {orderStep === 0 && (
                  <Button onClick={() => setScreen('services')} variant="ghost" className="w-full">
                    <Icon name="X" size={16} className="mr-2" />
                    Отменить
                  </Button>
                )}
              </div>
            )}

            {screen === 'faq' && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-2xl font-bold text-center font-handwritten text-primary">Частые вопросы</h3>

                <Card className="p-4 space-y-3">
                  <div>
                    <p className="font-bold mb-1">Сколько времени занимает разработка?</p>
                    <p className="text-sm text-muted-foreground">Зависит от тарифа: от 2 до 5 дней.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Что нужно предоставить?</p>
                    <p className="text-sm text-muted-foreground">Ссылку на товар, фото, описание преимуществ.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Работаете по предоплате?</p>
                    <p className="text-sm text-muted-foreground">Да, 50% предоплата, 50% после утверждения.</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Делаете верстку A+ контента?</p>
                    <p className="text-sm text-muted-foreground">Да! Загружаем готовый контент на маркетплейс.</p>
                  </div>
                </Card>

                <Button onClick={() => setScreen('menu')} variant="ghost" className="w-full">
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад
                </Button>
              </div>
            )}

            {screen === 'reviews' && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-2xl font-bold text-center font-handwritten text-primary">Отзывы клиентов</h3>

                <Card className="p-4 border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mb-2">"Ребята сделали невероятную карточку! Продажи выросли в 3 раза за месяц. Рекомендую!"</p>
                  <p className="text-xs text-muted-foreground">— Анна, владелец бренда косметики</p>
                </Card>

                <Card className="p-4 border-l-4 border-secondary">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mb-2">"Быстро, качественно, креативно. Лендинг получился огонь! 🔥"</p>
                  <p className="text-xs text-muted-foreground">— Дмитрий, интернет-магазин электроники</p>
                </Card>

                <Card className="p-4 border-l-4 border-accent">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mb-2">"A+ контент вывел наш товар в ТОП. Спасибо за профессионализм!"</p>
                  <p className="text-xs text-muted-foreground">— Екатерина, бренд спортивной одежды</p>
                </Card>

                <Button onClick={() => setScreen(screen === 'reviews' ? 'menu' : 'start')} variant="ghost" className="w-full">
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад
                </Button>
              </div>
            )}

            {screen === 'promo' && (
              <div className="animate-fade-in space-y-4 text-center">
                <div className="text-6xl">🎁</div>
                <h3 className="text-2xl font-bold font-handwritten text-primary">Акция!</h3>
                <Card className="p-6 bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary">
                  <Badge className="bg-secondary text-white text-lg px-4 py-2 mb-4">
                    -10% на первый заказ
                  </Badge>
                  <p className="text-sm mb-4">При оформлении через бота получите скидку 10% на любую услугу!</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✅ Бесплатный аудит 1 карточки</p>
                    <p>✅ Консультация дизайнера</p>
                    <p>✅ Ускоренное выполнение</p>
                  </div>
                </Card>
                <Button onClick={() => setScreen('services')} className="w-full bg-gradient-to-r from-primary to-secondary">
                  Оформить заказ со скидкой
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
                <Button onClick={() => setScreen('start')} variant="ghost" className="w-full">
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад
                </Button>
              </div>
            )}

            {messages.length > 0 && (
              <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto">
                <Card className="p-3 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-primary/20 animate-slide-up">
                  <p className="text-sm">{messages[messages.length - 1].text}</p>
                </Card>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white flex items-center gap-2">
            <Input placeholder="Напишите сообщение..." className="flex-1" disabled />
            <Button size="icon" className="bg-primary" disabled>
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </Card>

        <div className="text-center mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Токен бота: <code className="text-xs bg-muted px-2 py-1 rounded">8537462266:AAE_R5Pk...</code>
          </p>
          <a href="/admin" className="inline-block text-sm text-primary hover:underline">
            🔐 Админ-панель
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;