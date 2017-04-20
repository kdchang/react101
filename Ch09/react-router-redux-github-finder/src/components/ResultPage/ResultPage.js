import React from 'react';
import GithubBox from '../../components/GithubBox';

const ResultPage = props => (
  <div>
    <GithubBox data={props.data} userId={props.location.query.userId} />
  </div>
);

export default ResultPage;
