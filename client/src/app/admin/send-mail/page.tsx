'use client';

export const dynamic = 'force-dynamic';

import nextDynamic from 'next/dynamic';
import { postRequest } from '@/utils/apiUtils';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

// ✅ Dynamically import the editor
const CustomEditor = nextDynamic(() => import('@/components/Editor'), { ssr: false });

function EmailForm() {
  const params = useSearchParams();
  const email = params.get('email') as string;

  const [editorContent, setEditorContent] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submit = async () => {
    if (!subject.trim()) {
      alert('Please enter a subject');
      return;
    }

    if (!editorContent.trim() || editorContent === '<p><br></p>') {
      alert('Please enter some content');
      return;
    }

    setIsLoading(true);
    try {
      await postRequest('/shipment/send/mail', {
        subject,
        content: editorContent,
        email,
      });
      alert('Email sent successfully!');
      setSubject('');
      setEditorContent('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Send Email To {email}
          </h1>

          {/* Subject Input */}
          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          {/* Email Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Content
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <CustomEditor
                value={editorContent}
                onChange={(content: string) => setEditorContent(content)}
                placeholder="Start writing your email content here..."
                readOnly={false}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={submit}
              disabled={isLoading}
              className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Email'}
            </button>

            <button
              onClick={() =>
                console.log('Subject:', subject, 'Content:', editorContent)
              }
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Preview Content
            </button>

            <button
              onClick={() => {
                setSubject('');
                setEditorContent('');
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Wrap in Suspense to fix useSearchParams warning
export default function NewArticlePage() {
  return (
    <Suspense fallback={<div>Loading email form...</div>}>
      <EmailForm />
    </Suspense>
  );
}
