import { defineComponent, h, reactive } from 'vue';

export const Head = defineComponent({
  name: 'InertiaHead',
  props: { title: String },
  setup() {
    return () => null;
  }
});

export const Link = defineComponent({
  name: 'InertiaLink',
  props: {
    href: { type: String, default: '#' },
    method: { type: String, default: 'get' },
    as: { type: String, default: 'a' }
  },
  setup(props, { slots, attrs }) {
    return () => h(props.as, { href: props.href, ...attrs }, slots.default ? slots.default() : []);
  }
});

export function usePage() {
  return {
    props: {
      auth: {
        user: {
          id: 1,
          name: 'Kestrel Operator',
          email: 'user@example.com'
        }
      },
      modelDirectory: 'Websites',
      handoffAlerts: []
    },
    url: '/websites'
  };
}

export function useForm(initialValues = {}) {
  const form = reactive({
    ...initialValues,
    processing: false,
    errors: {},
    hasErrors: false,
    wasSuccessful: false,
    recentlySuccessful: false,
    reset(...fields) {
      if (fields.length === 0) {
        Object.keys(initialValues).forEach((k) => {
          form[k] = initialValues[k];
        });
      } else {
        fields.forEach((f) => {
          form[f] = initialValues[f];
        });
      }
    },
    clearErrors() {
      form.errors = {};
      form.hasErrors = false;
    },
    post(url, options = {}) {
      if (options.onSuccess) options.onSuccess();
      if (options.onFinish) options.onFinish();
    },
    put(url, options = {}) {
      if (options.onSuccess) options.onSuccess();
      if (options.onFinish) options.onFinish();
    },
    delete(url, options = {}) {
      if (options.onSuccess) options.onSuccess();
      if (options.onFinish) options.onFinish();
    }
  });
  return form;
}

export const router = {
  visit: () => {},
  get: () => {},
  post: () => {},
  put: () => {},
  delete: () => {},
  reload: () => {}
};
