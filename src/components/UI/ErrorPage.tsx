import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { HiExclamationCircle, HiRefresh, HiHome } from 'react-icons/hi';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    let errorMessage = "알 수 없는 오류가 발생했습니다.";
    let errorStatus = "";

    if (isRouteErrorResponse(error)) {
        errorStatus = error.status.toString();
        errorMessage = error.statusText || error.data?.message || errorMessage;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: '#fff',
            fontFamily: 'sans-serif',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{ maxWidth: '400px' }}>
                <HiExclamationCircle size={64} color="#ff4d4d" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
                    {errorStatus && <span style={{ opacity: 0.5, marginRight: '10px' }}>{errorStatus}</span>}
                    오류 발생
                </h1>
                <p style={{ color: '#888', marginBottom: '30px', lineHeight: '1.5' }}>
                    {errorMessage}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            background: '#333',
                            border: '1px solid #444',
                            color: '#fff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <HiRefresh /> 새로고침
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #45c0ff, #5a42ec)',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <HiHome /> 홈으로
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
