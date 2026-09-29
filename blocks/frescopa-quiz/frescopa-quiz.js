const RESULT_KEYWORDS = ['result', 'results', 'risultato', 'risultati'];

function readOption(cell) {
  const list = cell.querySelector('ul, ol');
  const items = list ? [...list.children].map((li) => li.textContent.trim()) : [];

  // a two-item list without media authors a slider option (min/max labels)
  if (items.length === 2 && !cell.querySelector('picture, img')) {
    return { type: 'slider', min: items[0], max: items[1] };
  }

  const picture = cell.querySelector('picture');
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture').forEach((pic) => {
    const wrapper = pic.closest('p');
    if (wrapper) wrapper.remove();
    else pic.remove();
  });

  return {
    type: 'choice',
    picture,
    label: clone.textContent.trim(),
  };
}

function parseBlock(block) {
  const questions = [];
  const result = { title: '', description: '', cta: null };

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;

    const first = cells[0].textContent.trim();
    if (RESULT_KEYWORDS.includes(first.toLowerCase())) {
      result.title = cells[1]?.textContent.trim() || '';
      result.description = cells[2]?.textContent.trim() || '';
      result.cta = cells[3]?.querySelector('a') || null;
      return;
    }

    const options = cells.slice(1)
      .filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img'))
      .map(readOption);

    if (first && options.length) questions.push({ question: first, options });
  });

  return { questions, result };
}

function renderProgress(step, total) {
  const progress = document.createElement('p');
  progress.className = 'frescopa-quiz-progress';
  progress.textContent = `Domanda ${step + 1} di ${total}`;
  return progress;
}

function renderSliders(question, onNext) {
  const form = document.createElement('form');
  form.className = 'frescopa-quiz-sliders';

  question.options.forEach((opt) => {
    const row = document.createElement('div');
    row.className = 'frescopa-quiz-slider-row';

    const labels = document.createElement('div');
    labels.className = 'frescopa-quiz-slider-labels';
    const min = document.createElement('span');
    min.textContent = opt.min;
    const max = document.createElement('span');
    max.textContent = opt.max;
    labels.append(min, max);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = '0';
    input.max = '10';
    input.value = '5';
    input.className = 'frescopa-quiz-slider';
    input.setAttribute('aria-label', `${opt.min} – ${opt.max}`);

    row.append(labels, input);
    form.append(row);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'frescopa-quiz-submit';
  submit.textContent = 'Continua';
  form.append(submit);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const values = [...form.querySelectorAll('input[type="range"]')].map((i) => Number(i.value));
    onNext({ sliders: values });
  });

  return form;
}

function renderChoices(question, onNext) {
  const list = document.createElement('div');
  list.className = 'frescopa-quiz-options';

  question.options.forEach((opt, idx) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'frescopa-quiz-option';

    if (opt.picture) {
      const wrapper = document.createElement('span');
      wrapper.className = 'frescopa-quiz-option-image';
      wrapper.append(opt.picture.cloneNode(true));
      button.append(wrapper);
    }

    const label = document.createElement('span');
    label.className = 'frescopa-quiz-option-label';
    label.textContent = opt.label;
    button.append(label);

    button.addEventListener('click', () => onNext({ index: idx, label: opt.label }));
    list.append(button);
  });

  return list;
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const { questions, result } = parseBlock(block);
  if (!questions.length) return;

  const answers = [];
  let step = 0;

  const view = document.createElement('div');
  view.className = 'frescopa-quiz-view';

  function renderResult() {
    const panel = document.createElement('div');
    panel.className = 'frescopa-quiz-result';

    const title = document.createElement('h2');
    title.textContent = result.title || 'Il tuo profilo';
    panel.append(title);

    if (result.description) {
      const description = document.createElement('p');
      description.textContent = result.description;
      panel.append(description);
    }

    const summary = document.createElement('ul');
    summary.className = 'frescopa-quiz-summary';
    questions.forEach((question, idx) => {
      const answer = answers[idx];
      if (!answer) return;
      const item = document.createElement('li');
      const term = document.createElement('strong');
      term.textContent = question.question;
      const value = document.createElement('span');
      value.textContent = answer.label ?? (answer.sliders || []).join(' · ');
      item.append(term, value);
      summary.append(item);
    });
    if (summary.children.length) panel.append(summary);

    const actions = document.createElement('div');
    actions.className = 'frescopa-quiz-actions';

    if (result.cta) {
      const cta = result.cta.cloneNode(true);
      cta.classList.add('frescopa-quiz-cta');
      actions.append(cta);
    }

    const again = document.createElement('button');
    again.type = 'button';
    again.className = 'frescopa-quiz-restart';
    again.textContent = 'Ricomincia il quiz';
    again.addEventListener('click', () => {
      answers.length = 0;
      step = 0;
      // eslint-disable-next-line no-use-before-define
      renderStep();
    });
    actions.append(again);

    panel.append(actions);
    return panel;
  }

  function renderStep() {
    view.textContent = '';

    if (step >= questions.length) {
      view.append(renderResult());
      return;
    }

    const next = (answer) => {
      answers[step] = answer;
      step += 1;
      renderStep();
    };

    const question = questions[step];
    const panel = document.createElement('div');
    panel.className = `frescopa-quiz-step frescopa-quiz-step-${step}`;

    const heading = document.createElement('h2');
    heading.className = 'frescopa-quiz-question';
    heading.textContent = question.question;
    panel.append(heading);

    const isSlider = question.options.every((opt) => opt.type === 'slider');
    panel.append(isSlider ? renderSliders(question, next) : renderChoices(question, next));
    panel.append(renderProgress(step, questions.length));

    view.append(panel);
  }

  block.textContent = '';
  block.append(view);
  renderStep();
}
