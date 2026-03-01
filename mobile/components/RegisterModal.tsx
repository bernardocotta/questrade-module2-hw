import { View } from 'react-native';
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useLotteryRegister from '../hooks/useLotteryRegister';

const registerSchema = Yup.object({
  name: Yup.string().min(4).required(),
});

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedLotteries: Array<string>;
}

export default function RegisterModal({
  visible,
  onClose,
  onSubmit,
  selectedLotteries,
}: Props) {
  const { error, loading, registerToLotteries } = useLotteryRegister();

  const formik = useFormik({
    validationSchema: registerSchema,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      name: '',
    },
    onSubmit: ({ name }) => {
      registerToLotteries({ name, lotteries: selectedLotteries })
        .then(() => {
          onSubmit();
          handleClose();
        })
        .catch(() => {});
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={{
          backgroundColor: 'white',
          margin: 24,
          padding: 24,
          borderRadius: 8,
        }}
      >
        <Text variant="headlineSmall" style={{ marginBottom: 24 }}>
          Register to lotteries
        </Text>

        <TextInput
          label="Enter your name"
          mode="outlined"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          error={Boolean(formik.touched.name && formik.errors.name)}
        />
        <HelperText
          type="error"
          visible={Boolean(formik.touched.name && formik.errors.name)}
        >
          {formik.errors.name}
        </HelperText>

        {error && (
          <HelperText type="error" visible>
            {error}
          </HelperText>
        )}

        <Button
          mode="contained"
          onPress={() => formik.handleSubmit()}
          loading={loading}
          disabled={!formik.isValid || loading}
          style={{ alignSelf: 'center', marginTop: 8 }}
        >
          Register
        </Button>
      </Modal>
    </Portal>
  );
}
