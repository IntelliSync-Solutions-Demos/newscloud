import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

// Define an enum for date categories
enum DateCategory {
  Anniversary = 'Anniversary',
  Birthday = 'Birthday',
  Holiday = 'Holiday',
  Memorial = 'Memorial',
  Personal = 'Personal',
  Other = 'Other'
}

// Define an interface for the date object
interface DateEntry {
  id: number;
  title: string;
  date: string;
  description?: string;
  category: DateCategory;
  imageUrl?: string;
}

export default function PersonalDates() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [newDate, setNewDate] = useState('');
  const [dates, setDates] = useState<DateEntry[]>([
    { 
      id: 1, 
      title: 'Wedding Anniversary', 
      date: '2024-02-14', 
      description: 'Celebrate our love',
      category: DateCategory.Anniversary 
    },
    { 
      id: 2, 
      title: 'Birthday', 
      date: '2024-07-22', 
      description: 'Another year older!',
      category: DateCategory.Birthday 
    },
  ]);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Partial<DateEntry>>({});

  const addDate = () => {
    if (modalDate.date && modalDate.title) {
      const newDateEntry: DateEntry = {
        id: dates.length + 1,
        title: modalDate.title,
        date: modalDate.date,
        description: modalDate.description || '',
        category: modalDate.category || DateCategory.Personal,
        imageUrl: modalDate.imageUrl
      };

      setDates([...dates, newDateEntry]);
      
      // Reset modal state
      setModalDate({});
      setIsModalOpen(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);

    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const eventsOnDate = dates.filter(d => d.date === formattedDate);

      if (eventsOnDate.length === 0) {
        toast({
          title: "No Events",
          description: "No events on this date.",
          variant: "default"
        });
      }
    }
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    return dates.filter(d => d.date === formattedDate);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Important Dates
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsModalOpen(true)}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Important Date</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input 
                    type="text" 
                    placeholder="Title" 
                    value={modalDate.title || ''} 
                    onChange={(e) => setModalDate({...modalDate, title: e.target.value})} 
                  />
                  <Input 
                    type="date" 
                    value={modalDate.date || ''} 
                    onChange={(e) => setModalDate({...modalDate, date: e.target.value})} 
                  />
                  <Select 
                    value={modalDate.category || ''} 
                    onValueChange={(value) => setModalDate({...modalDate, category: value as DateCategory})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DateCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea 
                    placeholder="Description (optional)" 
                    value={modalDate.description || ''} 
                    onChange={(e) => setModalDate({...modalDate, description: e.target.value})} 
                  />
                  <Input 
                    type="text" 
                    placeholder="Image URL (optional)" 
                    value={modalDate.imageUrl || ''} 
                    onChange={(e) => setModalDate({...modalDate, imageUrl: e.target.value})} 
                  />
                  <Button onClick={addDate} className="w-full">Save Date</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {selectedDate 
                    ? `Events on ${format(selectedDate, 'MMMM d, yyyy')}` 
                    : 'Upcoming Dates'
                  }
                </h3>
                <ul className="space-y-2">
                  {(selectedDate ? getEventsForSelectedDate() : dates).map((date) => (
                    <li 
                      key={date.id} 
                      className="bg-gray-100 p-2 rounded flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium">{date.title}</span>
                        <span className="text-sm text-gray-500 block">{date.category}</span>
                        <span className="text-sm text-gray-500">{date.date}</span>
                        {date.description && (
                          <p className="text-xs text-gray-600 mt-1">{date.description}</p>
                        )}
                      </div>
                      {date.imageUrl && (
                        <img 
                          src={date.imageUrl} 
                          alt={date.title} 
                          className="w-16 h-16 object-cover rounded" 
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Calendar 
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
