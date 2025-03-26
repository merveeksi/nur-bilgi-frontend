'use client';

import { useState } from 'react';

interface MessageFormProps {
  senderId: string;
  receiverId: string;
}

export default function MessageForm({ senderId, receiverId }: MessageFormProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    setIsSending(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('https://your-api-url.com/api/Messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          senderId,
          receiverId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      console.log('Message sent successfully with ID:', data.data);
      
      setSuccess(true);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Send Message</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          Message sent successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSending}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

// Page component
export function MessagePage() {
  // In a real app, these IDs would come from authentication or page params
  const senderId = 'user123';
  const receiverId = 'user456';
  
  return (
    <div className="container mx-auto max-w-md py-8">
      <MessageForm senderId={senderId} receiverId={receiverId} />
    </div>
  );
} 