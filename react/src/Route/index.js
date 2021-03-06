import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.scss';
import RESPONSE_FILES from '../model/response-files.json';

const LOCAL_STORE_KEY = 'LOCAK_ORDER_KEY';
const MAX_LENGTH = 3;
const ITEM_SIZE = 150;
const ITEM_MARGIN = 5;
const BLOCK_SIZE = ITEM_SIZE + ITEM_MARGIN;

let diff = { top: 0, left: 0 };
let lastPostion = {};

const getContents = () =>
  fetch('https://api.github.com/repos/Yesifan/Show/contents/react/src/Route/')
    .then(response => response.json())
    .then(res => {
      if (res.message) res = RESPONSE_FILES;
      return res.filter(file => file.type === 'dir' && file.name !== '404');
    })
    .then(res => {
      const regPos = /^\d+$/;
      const order = JSON.parse(localStorage.getItem(LOCAL_STORE_KEY)) || [];
      let length = Object.keys(order).length;
      return res.map(file => {
        file.index = regPos.test(order[file.name])
          ? order[file.name]
          : length++;
        file.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        file.width = `${ITEM_SIZE}px`;
        file.height = `${ITEM_SIZE}px`;
        file.position = position(file.index);
        return file;
      });
    });

export default () => {
  const [contents, setContents] = useState([]);
  const [moving, setMoving] = useState(false);
  const row = contents.length ? contents[contents.length - 1].position.row : 0;
  useEffect(() => {
    getContents().then(res => {
      setContents(res);
    });
  }, []);

  function pointUpHandle(event, index) {
    let new_contents = [...contents];
    const block = new_contents[index];
    if (moving !== false) {
      setMoving(false); // 静止
      const target = event.currentTarget;
      target.releasePointerCapture(event.pointerId);
      block.position = position(block.index);
      setContents(new_contents);
      // new_contents.sort((a,b)=>a.index - b.index);
      store(new_contents);
    }
  }
  function pointMoveHandle(event, index) {
    if (event.buttons === 1) {
      const new_contents = [...contents];
      const block = new_contents[index];
      lastPostion = { ...block.position };
      if (moving === false) {
        setMoving(index); // 移动
        const target = event.currentTarget;
        diff = {
          top: event.clientY - target.offsetTop,
          left: event.clientX - target.offsetLeft
        };
        target.setPointerCapture(event.pointerId);
      }
      const top = event.clientY - diff.top;
      const left = event.clientX - diff.left;
      block.position.top = top;
      block.position.left = left;
      // 计算移动后属于哪个区块
      // 使用移动方向的那条边来判断归属
      // 移到超过边界 deviation 时
      const deviation = 100;
      const _top =
        top < lastPostion.top ? top + deviation : top + ITEM_SIZE - deviation;
      const _left =
        left < lastPostion.left
          ? left + deviation
          : left + ITEM_SIZE - deviation;
      const row = Math.ceil(_top / BLOCK_SIZE) || 1;
      const _col = Math.ceil(_left / BLOCK_SIZE);
      const col = (_col > MAX_LENGTH ? MAX_LENGTH : _col) || 1;
      const _index = (row - 1) * MAX_LENGTH + col - 1;
      const old_index = block.index;
      const new_index =
        _index >= contents.length ? contents.length - 1 : _index;
      // 不规则排列可以尝试用递归
      if (new_index !== old_index) {
        const isForward = new_index < old_index;
        new_contents.forEach(item => {
          if (isForward) {
            if (item.index < old_index && item.index >= new_index) {
              item.index++;
              item.position = position(item.index);
            }
          } else if (item.index > old_index && item.index <= new_index) {
            item.index--;
            item.position = position(item.index);
          }
        });
        block.index = new_index;
      }
      setContents(new_contents);
    }
  }
  return (
    <div className={style.index}>
      <h1>导航</h1>
      <section className={`${style.navs} ${moving !== false && style.move}`}>
        <nav
          style={{
            width: `${MAX_LENGTH * ITEM_SIZE +
              (MAX_LENGTH - 1) * ITEM_MARGIN}px`,
            height: `${row * ITEM_SIZE + (row - 1) * ITEM_MARGIN}px`
          }}>
          {contents.map((file, index) => (
            <div
              className={[style.router, moving === index && style.moving].join(
                ' '
              )}
              key={file.name}
              onPointerMove={event => pointMoveHandle(event, index)}
              onPointerUp={event => pointUpHandle(event, index)}
              style={{
                width: file.width,
                height: file.width,
                top: file.position.top,
                left: file.position.left,
                backgroundColor: file.color
              }}>
              <Link draggable="false" to={`/${file.name}`}>
                {file.name}
              </Link>
            </div>
          ))}
        </nav>
      </section>
    </div>
  );
};

const store = (() => {
  let timer = 0;
  const Timer = val => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      timer = 0;
      const local_contents = {};
      val.forEach(({ index, name }) => {
        local_contents[name] = index;
      });
      localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(local_contents));
    }, 1000);
  };
  return Timer;
})();

function position(i) {
  const index = i + 1;
  const row = Math.ceil(index / MAX_LENGTH);
  const col = index % MAX_LENGTH || MAX_LENGTH;
  const { top, left } = distance(row, col);
  return { top, left, row, col };
}

function distance(row, col) {
  const top = (row - 1) * (ITEM_SIZE + ITEM_MARGIN);
  const left = (col - 1) * (ITEM_SIZE + ITEM_MARGIN);
  return { top, left };
}
