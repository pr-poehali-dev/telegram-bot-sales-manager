import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: number;
  telegram_user_id: number;
  telegram_username: string;
  service: string;
  link: string;
  audience: string;
  advantages: string;
  references: string;
  deadline: string;
  tariff: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const API_URL = 'https://functions.poehali.dev/26b8b94b-443a-44b0-8da8-eb07846c21de';

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Статус заказа обновлен"
        });
        loadOrders();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  const deleteOrder = async (id: number) => {
    if (!confirm('Удалить заказ?')) return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Заказ удален"
        });
        loadOrders();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заказ",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-500',
      'in_progress': 'bg-yellow-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'pending_contact': 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'new': 'Новый',
      'in_progress': 'В работе',
      'completed': 'Завершен',
      'cancelled': 'Отменен',
      'pending_contact': 'Ожидает связи'
    };
    return labels[status] || status;
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary font-handwritten">Админ-панель</h1>
            <p className="text-muted-foreground">Управление заказами Telegram бота</p>
          </div>
          <Button onClick={loadOrders} variant="outline">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer" onClick={() => setFilter('all')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего заказов</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </div>
              <Icon name="ShoppingBag" size={32} className="text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer" onClick={() => setFilter('new')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Новые</p>
                <p className="text-3xl font-bold text-blue-500">{stats.new}</p>
              </div>
              <Icon name="Sparkles" size={32} className="text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer" onClick={() => setFilter('in_progress')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">В работе</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.in_progress}</p>
              </div>
              <Icon name="Clock" size={32} className="text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer" onClick={() => setFilter('completed')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Завершено</p>
                <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
              </div>
              <Icon name="CheckCircle" size={32} className="text-green-500 opacity-20" />
            </div>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Icon name="Loader2" size={48} className="animate-spin text-primary" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Inbox" size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl font-semibold mb-2">Заказов пока нет</p>
            <p className="text-muted-foreground">Новые заказы появятся здесь автоматически</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6 border-2 hover:shadow-xl transition-all animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold">Заказ #{order.id}</h3>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {new Date(order.created_at).toLocaleString('ru-RU')}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Услуга:</p>
                        <p className="font-semibold">{order.service}</p>
                      </div>
                      
                      {order.telegram_username && (
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">Telegram:</p>
                          <p className="font-mono">@{order.telegram_username}</p>
                        </div>
                      )}

                      {order.tariff && (
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">Тариф:</p>
                          <p>{order.tariff}</p>
                        </div>
                      )}

                      {order.deadline && (
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">Дедлайн:</p>
                          <p>{order.deadline}</p>
                        </div>
                      )}

                      {order.link && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-muted-foreground">Ссылка:</p>
                          <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm break-all">
                            {order.link}
                          </a>
                        </div>
                      )}

                      {order.audience && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-muted-foreground">Целевая аудитория:</p>
                          <p className="text-sm">{order.audience}</p>
                        </div>
                      )}

                      {order.advantages && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-muted-foreground">Преимущества:</p>
                          <p className="text-sm whitespace-pre-wrap">{order.advantages}</p>
                        </div>
                      )}

                      {order.references && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-semibold text-muted-foreground">Референсы:</p>
                          <p className="text-sm">{order.references}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-full md:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Новый</SelectItem>
                        <SelectItem value="pending_contact">Ожидает связи</SelectItem>
                        <SelectItem value="in_progress">В работе</SelectItem>
                        <SelectItem value="completed">Завершен</SelectItem>
                        <SelectItem value="cancelled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteOrder(order.id)}
                      className="md:w-40"
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
