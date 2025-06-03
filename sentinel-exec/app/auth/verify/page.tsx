'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { enableUser } from '@/services/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function VerifyPage() {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleVerify = async () => {
   setErrorMessage(''); 
    try {
      await enableUser(token);
      router.push('/auth/login');
    } catch (err: any) {
      const message =  'This token is invalid.';
      setErrorMessage(message); 
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex items-center items-center justify-center">
      <Card className="w-full max-w-sm ">
        <CardHeader>
            <CardTitle className="text-2xl">Verify Email</CardTitle>
            <CardDescription>
            Enter the code sent to your email.
            </CardDescription>
        </CardHeader>
        <CardContent>        
            <Input
            placeholder="Verification token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            />
        <Button className="w-full mt-6" onClick={handleVerify}>
          Verify
        </Button>
         {errorMessage && (
          <Alert variant="destructive" className="text-start text-sm text-red-600 mt-4">
            {errorMessage}
          </Alert>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
