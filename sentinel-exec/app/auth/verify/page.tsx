'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { enableUser } from '@/services/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleVerify = async () => {
    try {
      await enableUser(token);
      router.push('/auth/login'); 
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
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
        </CardContent>
      </Card>
    </div>
  );
}
