import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginForm.css';
// Agregar estas importaciones
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from '../assets/logo.svg';  // Add this line

const LoginForm = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required('Campo obligatorio'),
    password: Yup.string()
      .min(6, 'Mínimo 6 caracteres')
      .required('Campo obligatorio')
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error de autenticación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img 
          src={logo} 
          alt="Logo Matecitos" 
          className="logo-login"
        />
        <h2 className="login-title">
          Sistema de Administración de Matecitos Developers S.R.L.
        </h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <Field
                  name="email"
                  type="email"
                  className="login-input"
                  placeholder="ejemplo@matecitos.ar"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <Field
                  name="password"
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="login-button"
              >
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;