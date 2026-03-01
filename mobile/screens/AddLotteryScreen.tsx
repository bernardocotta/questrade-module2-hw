import { View } from 'react-native';
import { TextInput, HelperText, Button, Text } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useNewLottery } from '../hooks/useNewLottery';

const lotterySchema = Yup.object({
  name: Yup.string().min(4).required(),
  prize: Yup.string().min(4).required(),
});

export default function AddLotteryScreen() {
  const navigation = useNavigation();
  const { error, loading, createNewLottery } = useNewLottery();

  const formik = useFormik({
    validationSchema: lotterySchema,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      name: '',
      prize: '',
    },
    onSubmit: (values) => {
      createNewLottery({ name: values.name, prize: values.prize })
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'New lottery added successfully!',
          });
          navigation.goBack();
        })
        .catch(() => {});
    },
  });

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#fff' }}>
      <Text variant="headlineSmall" style={{ marginBottom: 24 }}>
        Add a new lottery
      </Text>

      <TextInput
        label="Lottery name"
        mode="flat"
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

      <TextInput
        label="Lottery prize"
        mode="flat"
        value={formik.values.prize}
        onChangeText={formik.handleChange('prize')}
        onBlur={formik.handleBlur('prize')}
        error={Boolean(formik.touched.prize && formik.errors.prize)}
      />
      <HelperText
        type="error"
        visible={Boolean(formik.touched.prize && formik.errors.prize)}
      >
        {formik.errors.prize}
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
      >
        Add
      </Button>
    </View>
  );
}
