export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/admins/login",
      permanent: false,
    },
  };
}

const HomePage = () => {
  return null;
};

export default HomePage;
