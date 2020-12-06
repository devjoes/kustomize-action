import YAML from 'yaml';
import {
  cleanUpYaml,
  removeKustomizeValues,
  checkSecrets,
  customValidation
} from './cleanYaml';
import {buildTestLogger} from './logger';
import {parseAllowedSecrets, parseCustomValidation} from './setup';

const createSecret = (ns: string, name: string) =>
  YAML.parseDocument(`
kind: Secret
apiVersion: v1
metadata:
  name: ${name}
  namespace: ${ns}
data:`);

const dirtyYaml = `kind: Deployment
apiVersion: apps/v1
metadata:
  name: foo
  namespace: bar
  creationtimestamp:
  labels:
    resource-type: application
spec:
  replicas: 2
  selector:
    matchLabels:
      resource-type: application
  template:
    metadata:
      labels:
        resource-type: application
      annotations: null
    spec:
      volumes:
        - name: tmp
          emptyDir: {}
      containers:
        - name: app
          image: 'nginx'
          ports:
            - containerPort: 5000
              protocol: TCP
          env:
            - name: foo
              value: 'bar'
            - name: should_be_string
              value: true
          resources:
            limits:
              cpu: 2000m
              memory: 2000Mi
            requests:
              cpu: 1
              memory: 1024M
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: test
data:
  isTrue: true
  isFalse: false`;

const cleanYaml = `kind: Deployment
apiVersion: apps/v1
metadata:
  name: foo
  namespace: bar
  labels:
    resource-type: application
spec:
  replicas: 2
  selector:
    matchLabels:
      resource-type: application
  template:
    metadata:
      labels:
        resource-type: application
    spec:
      volumes:
        - name: tmp
          emptyDir: {}
      containers:
        - name: app
          image: 'nginx'
          ports:
            - containerPort: 5000
              protocol: TCP
          env:
            - name: foo
              value: 'bar'
            - name: should_be_string
              value: "true"
          resources:
            limits:
              cpu: "2"
              memory: 2Gi
            requests:
              cpu: "1"
              memory: 1G
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: test
data:
  isTrue: "true"
  isFalse: "false"`;

const valuesYaml = `apiVersion: kustomize.config.k8s.io/v1
kind: Values
metadata:
  name: test
spec:
  foo: bar`;

test('cleans up YAML', () => {
  const input = YAML.parseAllDocuments(dirtyYaml);
  const clean = YAML.parseAllDocuments(cleanYaml);

  for (let i = 0; i < input.length; i++) {
    const result = cleanUpYaml(input[i]);
    expect(result.doc.toString()).toEqual(clean[i].toString());
    expect(result.modified).toEqual(i == 0);
  }
});
test('removeKustomizeValues removes "kind: Values" documents', () => {
  const input = [...YAML.parseAllDocuments(cleanYaml), YAML.parseDocument(valuesYaml)];
  const result = removeKustomizeValues(input, buildTestLogger());
  expect(result).toHaveLength(2);
  expect(result.toString()).toEqual(
    YAML.parseAllDocuments(cleanYaml).toString()
  );
});

test('checkYamlForSecrets', () => {
  const logs: string[] = [];
  const logger = buildTestLogger(logs);
  const logMsg = "Didn't find allowed secrets: default/foo";
  expect(() =>
    checkSecrets(
      [YAML.parseDocument(cleanYaml)],
      parseAllowedSecrets('default/foo'),
      logger
    )
  ).not.toThrow();
  expect(logs).toContain(logMsg);
  expect(() =>
    checkSecrets(
      [createSecret('default', 'foo')],
      parseAllowedSecrets('default/foo'),
      logger
    )
  ).not.toThrow();
  expect(logs.indexOf(logMsg)).toEqual(logs.lastIndexOf(logMsg));
  expect(() =>
    checkSecrets([createSecret('default', 'foo')], [], logger)
  ).toThrow();
  expect(() =>
    checkSecrets(
      [createSecret('default', 'foo'), createSecret('default2', 'foo')],
      parseAllowedSecrets('default/foo'),
      logger
    )
  ).toThrow();
  expect(() =>
    checkSecrets(
      [createSecret('default', 'foo'), createSecret('default', 'bar')],
      parseAllowedSecrets('default/foo'),
      logger
    )
  ).toThrow();
});

const rules = parseCustomValidation(
  `Contains oof or foo|true|/oof|foo/
Contains \\n bar or bar pipe|true|/\\nbar\\|?/
Doesnt contain baz|false|/baz/`
);
const logger = buildTestLogger();
test('Custom validation passes', () => {
  expect(customValidation('foo\nbar', rules, logger)).toHaveLength(0);
  expect(customValidation('oof\nbar\\|', rules, logger)).toHaveLength(0);
});
test('Custom validation fails', () => {
  expect(customValidation('fo\nba', rules, logger)).toHaveLength(2);
  expect(customValidation('\nbar|', rules, logger)).toHaveLength(1);
  expect(customValidation('baz', rules, logger)).toHaveLength(3);
  expect(customValidation('foo\nbarbaz', rules, logger)).toEqual([
    'Doesnt contain baz\nbaz'
  ]);
});
