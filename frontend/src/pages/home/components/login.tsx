import { useAuth } from '@/components/providers/auth-context';
import { Button, Input, Label } from '@/components/ui';
import { Api } from '@/services/api';
import { LoadingSpinner } from '@/shared/icon';
import { LoginSchema, loginSchema } from '@/types/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const Login = () => {
  const { login } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: Api.login,
    mutationKey: ['login-user'],
    onError: () => {
      toast.error('Credenciais inválidas');
    },
    onSuccess: async (token) => {
      localStorage.setItem('aprove-auth', JSON.stringify(token));
      toast.success('Login realizado');
      await new Promise((r) => setTimeout(r, 1500));
      login(token);
    },
  });

  const { register, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmitLogin = (data: LoginSchema) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitLogin)}>
      <div className="space-y-1">
        <Label htmlFor="username">Login</Label>
        <Input
          placeholder="Digite seu login"
          id="username"
          {...register('username')}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Senha</Label>
        <Input
          placeholder="******"
          type="password"
          id="password"
          {...register('password')}
        />
      </div>

      <Button type="submit" className="mt-4 w-full" disabled={isPending}>
        {isPending ? <LoadingSpinner /> : 'Login'}
      </Button>
    </form>
  );
};
