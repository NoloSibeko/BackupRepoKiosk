import { Box, styled } from '@mui/material';
import { motion } from 'framer-motion';

const AuthContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
});

const FormSection = styled(motion.div)({
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
});

const GraphicSection = styled(Box)(({ theme }) => ({
  width: '50%',
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  padding: '2rem',
}));

export const AuthLayout = ({ children, graphicContent }) => {
  return (
    <AuthContainer>
      <FormSection
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {children}
      </FormSection>
      
      <GraphicSection>
        {graphicContent}
      </GraphicSection>
    </AuthContainer>
  );
};