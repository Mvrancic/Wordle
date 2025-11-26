import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold text-white">404</h1>
            <p className="text-gray-300 text-xl">Página no encontrada</p>
            <Button onClick={() => navigate('/')} variant="primary">
              Volver al inicio
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

