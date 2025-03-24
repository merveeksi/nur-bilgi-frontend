"use client";

import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadIlmihal() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      setMessage('Lütfen bir PDF dosyası seçin');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('PDF yükleniyor...');

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const res = await fetch('/api/ilmihal/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMessage('PDF başarıyla yüklendi ve veritabanına kaydedildi.');
      } else {
        setStatus('error');
        setMessage(`Hata: ${json.error || 'Bilinmeyen bir hata oluştu'}`);
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(`Hata: ${err.message || 'Bilinmeyen bir hata oluştu'}`);
    }
  };

  return (
    <div className="container mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-6">İlmihal PDF Yükleme</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80"
              >
                <span>PDF dosyası seçin</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setPdfFile(e.target.files[0]);
                      setStatus('idle');
                      setMessage('');
                    }
                  }}
                />
              </label>
              <p className="pl-1">veya sürükleyip bırakın</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PDF formatında 10MB'a kadar</p>
          </div>
          
          {pdfFile && (
            <div className="px-3 py-2 bg-gray-50 text-sm rounded flex items-center">
              <span className="font-medium">{pdfFile.name}</span>
              <span className="ml-2 text-gray-500">({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={status === 'loading' || !pdfFile}
            className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Yükleniyor...' : 'Yükle ve Kaydet'}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-4 rounded-lg flex items-start ${
            status === 'success' ? 'bg-green-50 text-green-700' : 
            status === 'error' ? 'bg-red-50 text-red-700' : 
            'bg-blue-50 text-blue-700'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : status === 'error' ? (
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : null}
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
