import { render, screen } from '@testing-library/react';
import Login from '../src/pages/login';
import Register from '../src/pages/register';
import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('../src/lib/firebase', () => ({
    auth: {},
}));

// Mock useRouter
jest.mock('next/router', () => ({
    useRouter() {
        return {
            push: jest.fn(),
        };
    },
}));

describe('Smoke Tests', () => {
    it('renders Login page', () => {
        render(<Login />);
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders Register page', () => {
        render(<Register />);
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
});
